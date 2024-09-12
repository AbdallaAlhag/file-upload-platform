const multer = require('multer');
const path = require('path');

// Multer setup with custom file filter to accept various work-related files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit (you can adjust this)
    fileFilter: (req, file, cb) => {
        const filetypes = /docx|pdf|xlsx|txt|pptx|jpg|jpeg|png|gif/;
        const mimetype = /application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/pdf|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|text\/plain|application\/vnd.openxmlformats-officedocument.presentationml.presentation|image\/jpeg|image\/png|image\/gif/;

        const validMimetype = mimetype.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (validMimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Supported file types are .docx, .pdf, .xlsx, .txt, .pptx, .jpg, .jpeg, .png, .gif');
        }
    }
}).single('file'); // Allow one file upload at a time

module.exports = upload;
