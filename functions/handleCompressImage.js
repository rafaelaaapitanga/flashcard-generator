const compressImages = require("compress-images")

const handleCompressImage = async (image, newFolder) => {
  return new Promise((resolve, reject) => {
    compressImages(
      image,
      newFolder, 
      { compress_force: false, statistic: true, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
      { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
      { svg: { engine: false, command: false } },
      { gif: { engine: false, command: false } },
      (error, completed, statistic) => {
        if (error) {
          console.error("Compression Error:", error)
          reject(error)
        } else {
          resolve({ completed, statistic })
        } 
      }
    )
  })
}

module.exports = handleCompressImage