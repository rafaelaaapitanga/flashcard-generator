const { ocrSpace } = require('ocr-space-api-wrapper')

const apiKey = 'K83400168088957'

const getTextFromImage = async (image, newFolder, language = 'por') => {
  const result = await ocrSpace(newFolder + image, { apiKey, language })

  return result.ParsedResults[0].ParsedText
}

module.exports = getTextFromImage
