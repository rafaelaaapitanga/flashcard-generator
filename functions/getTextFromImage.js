const { ocrSpace } = require('ocr-space-api-wrapper')

const apiKey = 'K83400168088957'

const getTextFromImage = async (imageFile, newFolder, language = 'por') => {
  const result = await ocrSpace(newFolder + imageFile, { apiKey, language })

  return result.ParsedResults[0].ParsedText
}

module.exports = getTextFromImage
