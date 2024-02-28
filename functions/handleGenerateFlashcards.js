const { GoogleGenerativeAI } = require('@google/generative-ai')

const GOOGLE_API_KEY = 'AIzaSyCb93Vq_SrcHqv8SfcW6qhrCpGiqFItc7Q'

const configuration = new GoogleGenerativeAI(GOOGLE_API_KEY)
const model = configuration.getGenerativeModel({ model: 'gemini-pro' })

const handleGenerateFlashcards = async (prompt) => {
  const result = await model.generateContent(prompt)

  const questionsAndAnswers = result.response.candidates[0].content.parts[0].text.split('\n').filter(elem => elem != '' && (elem.includes('Pergunta') || (elem.includes('Resposta')))).map(elem => elem.replace(/\*/g, ''))

  let csvContent = ''

  for (let i = 0; i < questionsAndAnswers.length; i += 2) {
    const question = questionsAndAnswers[i].replace('Pergunta: ', '')
    const answer = questionsAndAnswers[i + 1].replace('Resposta: ', '')
      
    csvContent += `"${question}";"${answer}"\n`
  }

  return csvContent
}

module.exports = handleGenerateFlashcards