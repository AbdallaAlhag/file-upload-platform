const upload = require("../middleware/upload");
const prisma = require("../db/prisma");
const path = require("path");
const fs = require('fs');


exports.fileUpload = (req, res) => {
    upload(req, res, async (err) => {


        if (err) {
            console.error('Upload Error:', err);
            // Display the error on the index page
            return res.status(400).render('index', { error: 'Error uploading file: ' + err });
        }

        // Check if req.file is undefined
        if (!req.file) {
            return res.status(400).render('index', { error: 'No file uploaded or invalid file type' });
        }

        // Check if the destination is undefined
        if (!req.file.destination) {
            return res.status(500).render('index', { error: 'File upload failed, destination not set' });
        }
        const fileUploadPath = path.join(req.file.destination, req.file.filename);
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(403).send('User not authenticated!');
        }

        try {
            // Create new folder root if it doesn't exist in Prisma DB for the current user

            const rootFolderName = 'root';
            const rootFolder = await prisma.folder.findFirst({ where: { name: 'root', userId: req.user.id } });
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
            return res.status(500).render('index', { error: 'Error saving file information to the database.' });

        }
    });
};

exports.fileDownload = async (req, res) => {
    try {
        const fileId = req.params.id;
        console.log('file id in controller:', fileId)
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
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the file by ID
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Check if the file is already shared with the user
        const existingShare = await prisma.sharedFile.findUnique({
            where: {
                fileId_userId: {
                    fileId: fileId,
                    userId: user.id
                }
            }
        });

        if (existingShare) {
            return res.status(400).send('File already shared with this user');
        }

        // Share the file with the user
        await prisma.sharedFile.create({
            data: {
                fileId: fileId,
                userId: user.id
            }
        });

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

exports.fileMove = async (req, res) => {
    const { folder: folderId, id: fileId } = req.params;
    // console.log(`Moving file ${fileId} to folder ${folderId}`);

    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        if (!folder) {
            return res.status(404).send('Folder not found');
        }
        // console.log('Folder found:', folder);

        const file = await prisma.file.findUnique({
            where: { id: fileId },
        });
        await prisma.file.update({
            where: { id: fileId },
            data: {
                folderId,
                location: `${folder.filePath}/${file.fileName}`
            }
        });
        // console.log(folder.filePath, file.fileName);
        res.status(200).send('File moved successfully');
    } catch (err) {
        console.error('Error moving file:', err);
        res.status(500).send('Error moving file');
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
        // console.log('File copied successfully!');
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
            const filePath = deletedFile.filePath;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Error deleting file');
                }

            });
            await prisma.RecentlyDeleted.delete({ where: { id: fileId } });
        }

        if (file) {
            await prisma.RecentlyDeleted.create({
                data: {
                    filePath: file.filePath,
                    fileName: file.fileName,
                    fileType: file.fileType,
                    fileSize: file.fileSize,
                    deletedAt: new Date(),
                    userId: file.userId,
                }
            });
            await prisma.file.delete({ where: { id: fileId } });

        }
        res.status(200).send('File deleted successfully');
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
}

exports.fileRestore = async (req, res) => {
    const fileId = req.params.id;

    try {
        const fileToRestore = await prisma.recentlyDeleted.findUnique({
            where: {
                id: fileId
            }
        });

        if (!fileToRestore) {
            return res.status(404).send('File not found');
        }

        await prisma.file.create({
            data: {
                fileName: fileToRestore.fileName,
                location: 'root/' + fileToRestore.fileName,
                filePath: fileToRestore.filePath,
                fileType: fileToRestore.fileType,
                fileSize: fileToRestore.fileSize,
                userId: fileToRestore.userId,
                lastOpenedAt: new Date(),
            }
        });

        await prisma.recentlyDeleted.delete({
            where: {
                id: fileId
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error restoring file:', error);
        res.status(500).send('Server Error');
    }
}

exports.createNewFolder = async (req, res) => {
    const folderName = req.params.name;
    try {
        const newFolder = await prisma.folder.create({
            data: {
                name: folderName,
                filePath: `/${folderName}`,
                userId: req.user.id,
            }
        });
        res.status(201).send(`Folder created successfully: ${newFolder.name}`);

    }

    catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).send('Error creating folder');
    }
}