const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const GOOGLE_API_KEY = 'AIzaSyCb93Vq_SrcHqv8SfcW6qhrCpGiqFItc7Q';

const configuration = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = configuration.getGenerativeModel({ model: 'gemini-pro' });

const handleGenerateFlashcards = async (text, quantity = 3) => {
  try {
    const prompt = `estou extraindo o texto de uma foto onde nela possui um ou mais tipos de conteúdo, por se tratar de uma foto com varios tipos de texto foque naqueles que realmente representam um determinado assunto e não um texto qualquer que estava naquela página, a partir do conteúdo que vou passar quero que você devolva ${quantity} resultados estilo flashcard (texto e resposta) com conteúdo aprofundado sobre o assunto e com no máximo 10 palavras na pergunta e 20 palavras na resposta, pois o foco é fazer um estudante de vestibular conseguir estudar por meio desses flashcards e passar na prova dele. texto: ${text}`;
  
    const result = await model.generateContent(prompt);
    const questionsAndAnswers = result.response.candidates[0].content.parts[0].text.split('\n').filter(elem => elem !== '');

    let tsvContent = '';

    for (let i = 0; i < Math.min(questionsAndAnswers.length, quantity * 2); i += 2) {
      const question = questionsAndAnswers[i].replace('Pergunta: ', '');
      const answer = questionsAndAnswers[i + 1].replace('Resposta: ', '');

      tsvContent += `${question}\t${answer}\n`;
    }

    // Salvar os flashcards em um arquivo TSV
    const tsvPath = `build/flashcards.tsv`;
    writeFileSync(tsvPath, tsvContent, 'utf-8');

    console.log('Arquivo flashcards.tsv gerado com sucesso:', tsvPath);
  } catch (error) {
    console.error('Erro ao gerar flashcards:', error.message);
  }
};

module.exports = handleGenerateFlashcards;
