const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs')

const GOOGLE_API_KEY = 'AIzaSyCb93Vq_SrcHqv8SfcW6qhrCpGiqFItc7Q'

const configuration = new GoogleGenerativeAI(GOOGLE_API_KEY)
const model = configuration.getGenerativeModel({ model: 'gemini-pro' })

const handleGenerateFlashcards = async (text, quantity = 1) => {
  const prompt = `estou extraindo o texto de uma foto onde nela possui um ou mais tipos de conteúdo, por se tratar de uma foto com varios tipos de texto foque naqueles que realmente representam um determinado assunto e não um texto qualquer que estava naquela página, a partir do conteúdo que vou passar quero que você devolva ${quantity} resultados estilo flashcard (texto e resposta) com conteúdo aprofundado sobre o assunto e com no maximo 10 palavras na pergunta e 20 palavras na resposta, pois o foco é fazer um estudante de vestibular conseguir estudar por meio desses flashcards e passar na prova dele. texto: ${text}`
  const result = await model.generateContent(prompt)
  const questionsAndAnswers = result.response.candidates[0].content.parts[0].text.split('\n').filter(elem => elem != '')

  let csvContent = ''

  for (let i = 0; i < questionsAndAnswers.length; i += 2) {
    const question = questionsAndAnswers[i].replace('Pergunta: ', '')
    const answer = questionsAndAnswers[i + 1].replace('Resposta: ', '')
      
    csvContent += `"${question}";"${answer}"\n`
  }

  fs.writeFile('flashcards.csv', csvContent, (err) => {
    if (err) throw err
    console.log('O arquivo foi criado com sucesso!')
  })
}

module.exports = handleGenerateFlashcards