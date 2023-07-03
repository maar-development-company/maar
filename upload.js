const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // ファイルの保存先
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // ファイル名
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  console.log("File uploaded successfully.");
  console.log("Full path: ", path.resolve(req.file.path)); // フルパスの表示
  res.send({filePath: req.file.path, fullPath: path.resolve(req.file.path)});
});

module.exports = router;
