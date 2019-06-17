const multer = require("multer")
const path = require("path");


const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/home/maged/Desktop/todo_api/public/img/avatars/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.split(".").slice(0, -1).join(".") + '-' + Date.now() + path.extname(file.originalname));
    }
});

const avatarUpload = multer({storage: avatarStorage});

module.exports.avatarUpload = avatarUpload;