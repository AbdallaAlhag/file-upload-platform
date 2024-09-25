const multer = require('multer');
const path = require('path');

// Read from disk and saved locally
// Multer Setup: Multer is configured to save files to the uploads/ directory.
// File Reading: We use fs.readFile to read the file from the disk (uploads/ directory).
// Supabase Upload: After reading the file, we upload it to the Supabase storage using the supabase.storage.from().upload() method.
// File Deletion (Optional): Once the file is uploaded successfully to Supabase, we delete the local copy using fs.unlink() to avoid cluttering the server's disk.
// Error Handling: Handles errors for both the upload process and local file deletion.

// Multer setup with custom file filter to accept various work-related files

// disk storage

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Directory where files will be saved
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });


const storage = multer.memoryStorage(); // Store files in memory


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
