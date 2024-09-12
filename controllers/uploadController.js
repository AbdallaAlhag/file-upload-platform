const upload = require("../middleware/upload")
const prisma = require("../db/prisma");

exports.fileUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Handle multer errors (e.g. file too large)
            console.error('Upload Error:', err);
            return res.status(500).render('index', { error: 'Error uploading file' });
        }

        // Check if no file was selected
        if (!req.file) {
            return res.status(400).send('No file selected!');
        }

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(403).send('User not authenticated!');
        }

        try {
            // Create new file entry in Prisma DB
            await prisma.file.create({
                data: {
                    fileName: req.file.originalname,
                    filePath: req.file.path,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size,
                    user: {
                        connect: { id: req.user.id }  // Correct relation mapping
                    }
                }
            });

            // Redirect to the index or a success page
            res.redirect('/'); // or res.render('successPage');

        } catch (dbError) {
            console.error('Database Error:', dbError);
            return res.status(500).send('Error saving file information to the database.');
        }
    });
};
