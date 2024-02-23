const handleCompressImage = require('./functions/handleCompressImage')
const getTextFromImage = require('./functions/getTextFromImage')
const handleGenerateFlashcards = require('./functions/handleGenerateFlashcards')

const main = async () => {
  const imageFile = '11.jpg'
  const newFolder = 'build/'

  await handleCompressImage(imageFile, newFolder)
  const text = await getTextFromImage(imageFile, newFolder)
  await handleGenerateFlashcards(text, 3)
}

main()