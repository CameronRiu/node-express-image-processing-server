const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const router = Router();

function filename(request, file, callback) {
  callback(null, file.originalname);
}

const storage = multer.diskStorage(new Object({
  destination: 'api/uploads/',
  filename: filename
}));

function fileFilter(request, file, callback) {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
}

const upload = multer(new Object({
  fileFilter: fileFilter,
  storage: storage
}));

router.post('/upload', upload.single('photo'), (req, res) => {
  if (req.fileValidationError) {
    res.status(400).json(new Object({
      error: req.fileValidationError
    }));
  } else {
    res.status(201).json(new Object({
      success: true
    }));
  }
});

router.get('/photo-viewer', (req, res) => {
  res.sendFile(photoPath);
})


module.exports = router;