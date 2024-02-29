const { ocrSpace } = require('ocr-space-api-wrapper')

const apiKey = 'K83400168088957'

const getTextFromImage = async (imageFile, newFolder, language = 'por') => {
  try {
    console.log('Iniciando OCR para a imagem:', imageFile);
    const result = await ocrSpace(newFolder + imageFile, { apiKey, language });

    if (result && result.ParsedResults) {
      const parsedResults = result.ParsedResults;

      if (parsedResults.length > 0 && parsedResults[0].ParsedText) {
        return parsedResults[0].ParsedText;
      } else {
        console.error('Erro ao processar a imagem. A resposta do OCR não contém texto analisado.');
        return '';
      }
    } else {
      console.error('Erro ao processar a imagem. A resposta do OCR é inválida.');
      return '';
    }
  } catch (error) {
    console.error('Erro ao processar a imagem:', error.message);
    return '';
  }
};


module.exports = getTextFromImage
