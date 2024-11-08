const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Configurar multer para recibir el archivo como buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir y almacenar audios
router.post("/upload-audio", upload.single("audio"), async (req, res) => {
  console.log("Iniciando procesamiento de audio...");

  if (!req.file) {
    console.log("Error: No se subió ningún archivo");
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Error: No se proporcionó token de autenticación");
    return res.status(401).json({ error: "No se proporcionó token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const userId = decoded.id;

    const userFolderPath = path.join(
      __dirname,
      "../../../public/uploads/audio",
      userId.toString()
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
      console.log(`Carpeta creada: ${userFolderPath}`);
    }

    // Obtener el siguiente número disponible para el archivo
    const files = fs.readdirSync(userFolderPath);
    let highestNumber = 0;

    files.forEach(file => {
      const match = file.match(/^audio(\d+)\.mp3$/);
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    const nextNumber = highestNumber + 1;
    const outputFileName = `audio${nextNumber}.mp3`;
    const outputFilePath = path.join(userFolderPath, outputFileName);

    // Guardar el archivo de audio en el servidor
    fs.writeFileSync(outputFilePath, req.file.buffer);
    console.log(`Audio guardado con éxito en: ${outputFilePath}`);

    // Enviar la respuesta al frontend incluyendo la ruta del archivo
    res.status(200).json({
      message: "Audio recibido correctamente",
      filePath: `/uploads/audio/${userId}/${outputFileName}`,
    });
  } catch (error) {
    console.error("Error al procesar el audio:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error al procesar el audio" });
  }
});

module.exports = router;