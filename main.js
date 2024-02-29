const readline = require('readline');
const fs = require('fs').promises;
const handleCompressImage = require('./functions/handleCompressImage');
const getTextFromImage = require('./functions/getTextFromImage');
const handleGenerateFlashcards = require('./functions/handleGenerateFlashcards');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = async () => {
  rl.question('Digite o caminho da imagem: ', async (imagePath) => {
    const imageFile = imagePath.trim();
    const newFolder = 'build/';

    try {
      // Comprimir a imagem
      await handleCompressImage(imageFile, newFolder);

      // Extrair texto da imagem
      const text = await getTextFromImage(imageFile, newFolder);

      // Gerar flashcards
      await handleGenerateFlashcards(text, 3);

      rl.close();
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      rl.close();
    }
  });
};

main();