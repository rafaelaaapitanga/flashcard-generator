const express = require('express');
const multer = require('multer');
const { createReadStream, writeFileSync } = require('fs');
const { v4: uuidv4 } = require('uuid');
const { ocrSpace } = require('ocr-space-api-wrapper');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/processar-imagem', upload.single('image'), async (req, res) => {
    try {
      const imageBuffer = req.file.buffer;
      const imagePath = `build/${uuidv4()}.jpg`;
  
      // Salvar a imagem no servidor antes de executar o OCR
      writeFileSync(imagePath, imageBuffer);
  
      // Executar OCR na imagem
      const ocrResult = await ocrSpace(imagePath, { apiKey: 'K83400168088957', language: 'por' });
  
      // Verificar se o OCR retornou resultados
      if (!ocrResult || !ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
        throw new Error('Não foram encontrados resultados de OCR.');
      }
  
      // Obter o texto do OCR
      const text = ocrResult.ParsedResults[0].ParsedText;
  
      // Gerar flashcards usando o texto
      const configuration = new GoogleGenerativeAI('AIzaSyCb93Vq_SrcHqv8SfcW6qhrCpGiqFItc7Q');
      const model = configuration.getGenerativeModel({ model: 'gemini-pro' });
  
      const prompt = `estou extraindo o texto de uma foto onde nela possui um ou mais tipos de conteúdo, por se tratar de uma foto com varios tipos de texto foque naqueles que realmente representam um determinado assunto e não um texto qualquer que estava naquela página, a partir do conteúdo que vou passar quero que você devolva 3 resultados estilo flashcard (texto e resposta) com conteúdo aprofundado sobre o assunto e com no máximo 10 palavras na pergunta e 20 palavras na resposta, pois o foco é fazer um estudante de vestibular conseguir estudar por meio desses flashcards e passar na prova dele. texto: ${text}`;
      
      const result = await model.generateContent(prompt);
      const questionsAndAnswers = result.response.candidates[0].content.parts[0].text.split('\n').filter(elem => elem !== '');
  
      let tsvContent = '';
  
      for (let i = 0; i < Math.min(questionsAndAnswers.length, 6); i += 2) {
        const question = questionsAndAnswers[i].replace('Pergunta: ', '');
        const answer = questionsAndAnswers[i + 1].replace('Resposta: ', '');
  
        tsvContent += `${question}\t${answer}\n`;
      }
  
      // Salvar os flashcards em um arquivo TSV
      const tsvPath = `build/${uuidv4()}.tsv`;
      writeFileSync(tsvPath, tsvContent, 'utf-8');
  
      res.json({ fileUrl: tsvPath });
    } catch (error) {
      console.error('Erro ao processar a imagem:', error);
      res.status(500).json({ error: 'Erro ao processar a imagem.' });
    }
  });
  