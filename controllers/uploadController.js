const upload = require("../middleware/upload");
const prisma = require("../db/prisma");
const path = require("path");
const fs = require('fs');


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
                    filePath: req.file.filename,
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

exports.fileDownload = async (req, res) => {
    try {
        const fileId = req.params.id;
        // Fetch file information from the database
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Generate the correct file path
        const filePath = path.join(file.filePath);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found:', err);
                return res.status(404).send('File not found');
            }

            res.download(filePath, file.fileName, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).send('Error downloading file');
                }
            });
        });
    } catch (err) {
        console.error('Error fetching file from database:', err);
        res.status(500).send('Error fetching file information');
    }
};

exports.fileRename = async (req, res) => {
    const fileId = req.params.id;
    const newFileName = req.body.newFileName;
    try {
        await prisma.file.update({
            where: { id: fileId },
            data: { fileName: newFileName }
        });

        res.status(200).send('File renamed successfully');
    } catch (err) {
        console.error('Error renaming file:', err);
        res.status(500).send('Error renaming file');
    }
}

exports.fileStarred = async (req, res) => {
    const fileId = req.params.id;
    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
            select: { starred: true }
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        await prisma.file.update({
            where: { id: fileId },
            data: { starred: !file.starred }  // Toggle starred status
        });
        res.status(200).send('File starred successfully');
    } catch (err) {
        console.error('Error renaming file:', err);
        res.status(500).send('Error renaming file');
    }
}   