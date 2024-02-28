const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const { rimraf  } = require('rimraf')
const fs = require('fs')

const handleCompressImage = require('./functions/handleCompressImage')
const getTextFromImage = require('./functions/getTextFromImage')
const handleGenerateFlashcards = require('./functions/handleGenerateFlashcards')

const app = express()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      // Mantém a extensão original do arquivo
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.post('/text', async (request, response) => {
  const { quantity, text } = request.body

  const prompt = `desenvolva ${quantity} resultados estilo flashcard (texto e resposta) com conteúdo aprofundado sobre o tema que o usuario enviou e com no maximo 10 palavras na pergunta e 20 palavras na resposta, pois o foco é fazer o usuario passar no vestibular de medicina estudando por meio desses flashcards. o que o usuario escreveu foi: ${text}. foque apenas no tema que o usuario abordou, caso voce ache que não tem conteudo para gerar os flashcards tente ser mais criativo com o que foi fornecido pelo usuario. e respeite o numero de flashcards que devem ser produzidos que são ${quantity}`
  
  const flashcardsCsv = await handleGenerateFlashcards(prompt)

  return response.send(flashcardsCsv)
})

app.post('/image', upload.single('image'), async (request, response) => {
  const { quantity } = request.body

  const { path } = request.file

  const newFolder = 'build/'

  await handleCompressImage(path, newFolder)

  const text = await getTextFromImage(path, newFolder)

  const prompt = `estou extraindo o texto de uma foto onde nela possui um ou mais tipos de conteúdo, por se tratar de uma foto com varios tipos de texto foque naqueles que realmente representam um determinado assunto e não um texto qualquer que estava naquela página, a partir do conteúdo que vou passar quero que você devolva ${quantity} resultados estilo flashcard (texto e resposta) com conteúdo aprofundado sobre o assunto e com no maximo 10 palavras na pergunta e 20 palavras na resposta, pois o foco é fazer um estudante de vestibular conseguir estudar por meio desses flashcards e passar na prova dele. texto: ${text}`

  const flashcardsCsv = await handleGenerateFlashcards(prompt)

  const uploadsDir = __dirname + '\\uploads'
  const buildDir = __dirname + '\\build'

  await rimraf([uploadsDir, buildDir])

  const dir = './uploads'

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }

  return response.send(flashcardsCsv)
})

app.listen(process.env.PORT || 3333)