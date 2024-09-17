const upload = require("../middleware/upload");
const prisma = require("../db/prisma");
const path = require("path");
const fs = require('fs');


exports.fileUpload = (req, res) => {
    upload(req, res, async (err) => {
        const fileUploadPath = path.join(req.file.destination, req.file.filename);
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
            // FIX THIS 
            const rootFolderName = 'root';
            const rootFolder = await prisma.folder.findFirst({ where: { name: 'root' } });

            if (!rootFolder) {
                // Handle the case where the root folder is not found
                // You may want to create it here if it's critical for your application
                rootFolder = await prisma.folder.create({
                    data: {
                        name: rootFolderName,
                        filePath: '/root',  // Or another default value if needed
                        userId: req.user.id // Ensure you provide the correct user ID
                    }
                });
            }

            // Create a new file
            const newFile = await prisma.file.create({
                data: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size,
                    filePath: fileUploadPath,
                    location: rootFolder.name + '/' + req.file.originalname,
                    Folder: { connect: { id: rootFolder.id } },
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
        const filePath = file.filePath;
        fs.access(file.filePath, fs.constants.F_OK, (err) => {
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
exports.fileShare = async (req, res) => {
    const fileId = req.params.id;
    const userEmail = req.body.userEmail;
    try {
        const allUsers = await prisma.user.findMany();
        for (const user of allUsers) {
            if (user.email === userEmail) {
                // current file
                const file = await prisma.file.findUnique({
                    where: { id: fileId },
                });
                if (!file) {
                    return res.status(404).send('File not found');
                }

                // No need to upload the file again, just add the new user to the sharedWith relation
                await prisma.file.update({
                    where: { id: fileId },
                    data: {
                        sharedWith: {
                            connect: { id: user.id } // Connect the user you want to share the file with
                        }
                    }
                });
            }
        }
        res.status(200).send('File shared successfully');
    }
    catch (err) {
        console.error('Error sharing file:', err);
        res.status(500).send('Error sharing file');
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

exports.fileCopy = async (req, res) => {
    const fileId = req.params.id; // Get the file ID from the request body

    // Retrieve the original file from the database
    const originalFile = await prisma.file.findUnique({ where: { id: fileId }, select: { id: true, fileName: true, fileType: true, filePath: true, location: true, fileSize: true, userId: true } });

    if (!originalFile) {
        return res.status(404).send('File not found');
    }


    // Extract the file extension from the original file name
    const ext = path.extname(originalFile.fileName); // '.txt'
    const baseName = path.basename(originalFile.fileName, ext); // 'teststest'

    // Construct the new file name
    const newFileName = `${baseName}_copy${ext}`; // 'teststest_copy.txt'

    // Construct the new file path
    const newFilePath = `uploads/${newFileName}`;


    const oldFilePath = originalFile.filePath;

    // Create the directory if it doesn't exist

    const dir = path.dirname(newFilePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    try {
        // Copy the file in the file system
        fs.copyFileSync(oldFilePath, newFilePath);
        console.log('File copied successfully!');
        // Insert the new file entry into the database
        const rootFolder = await prisma.folder.findFirst({ where: { name: 'root' } });
        const newFile = await prisma.file.create({
            data: {
                fileName: newFileName,
                filePath: newFilePath,
                fileType: originalFile.fileType,
                fileSize: originalFile.fileSize,
                location: rootFolder.name + '/' + newFileName,
                userId: originalFile.userId, // Ensure the file is associated with the same user
            },
        });

        // Send success response
        return res.status(200).send('File copied successfully');
    } catch (error) {
        console.error('Error copying file:', error);
        return res.status(500).send('Error copying file');
    }
}

exports.fileDelete = async (req, res) => {
    const fileId = req.params.id;
    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!file) {
            const deletedFile = await prisma.RecentlyDeleted.findUnique({
                where: { id: fileId },
                select: { filePath: true }  // Select the filePath field
            });
            if (!deletedFile) {
                return res.status(404).send('File not found');
            }
        }

        if (file) {
            await prisma.RecentlyDeleted.create({
                data: {
                    filePath: file.filePath,
                    userId: file.userId,
                    fileName: file.fileName,
                    fileType: file.fileType,
                    fileSize: file.fileSize,
                }
            });
            await prisma.file.delete({ where: { id: fileId } });

            const filePath = file.filePath;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Error deleting file');
                }
                res.status(200).send('File deleted successfully');
            });
        }
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
}