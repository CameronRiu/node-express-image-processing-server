const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');
const imageProcessor = require('./imageProcessor');

const router = Router();

function filename(request, file, callback) {
  callback(null, file.originalname);
}

const storage = multer.diskStorage({
  destination: 'api/uploads/',
  filename
});

function fileFilter(request, file, callback) {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
}

const upload = multer({
  fileFilter,
  storage
});

router.post('/upload', upload.single('photo'), async (req, res) => {
  if (req.fileValidationError) {
    res.status(400).json({
      error: req.fileValidationError
    });
  }
  try {
    await imageProcessor(req.file.filename);
  } catch (err) {
    throw (err);
  }
  return res.status(201).json({
    success: true
  });
});

router.get('/photo-viewer', (req, res) => {
  res.sendFile(photoPath);
})


module.exports = router;