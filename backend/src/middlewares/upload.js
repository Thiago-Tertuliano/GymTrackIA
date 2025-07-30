const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configurar storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use apenas JPEG, PNG ou WebP.'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

// Middleware para processar imagem
const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filePath = req.file.path;
    const processedPath = filePath.replace(path.extname(filePath), '_processed' + path.extname(filePath));

    // Processar imagem com sharp
    await sharp(filePath)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80 })
      .toFile(processedPath);

    // Remover arquivo original
    fs.unlinkSync(filePath);
    
    // Atualizar caminho do arquivo
    req.file.path = processedPath;
    req.file.filename = path.basename(processedPath);

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para upload de foto de progresso
const uploadProgressPhoto = upload.single('photo');

module.exports = {
  upload,
  processImage,
  uploadProgressPhoto
}; 