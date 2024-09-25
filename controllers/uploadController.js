const upload = require("../middleware/upload");
const prisma = require("../db/prisma");
const supabase = require('../db/supabaseClient');
const path = require("path");
const fs = require('fs').promises; // Import fs with promises support


exports.fileUpload = async (req, res) => {
    // Handle file upload
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).render('index', { error: 'Error uploading file: ' + err });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).render('index', { error: 'No file uploaded or invalid file type' });
        }

        // Ensure user is authenticated (assuming req.user is set by auth middleware)
        if (!req.user) {
            return res.status(403).send('User not authenticated!');
        }


        // Step 1: Read the uploaded file from the 'uploads/' directory
        const filePath = path.join('uploads', req.file.filename);

        try {

            // Step 2: Read file from disk
            const fileBuffer = await fs.readFile(filePath);

            // Step 3: Upload file to Supabase storage bucket
            const { data, error: uploadError } = await supabase.storage
                .from('File-Upload-app')  // Replace with your actual bucket name
                .upload(req.file.filename, fileBuffer, {
                    contentType: req.file.mimetype,
                    upsert: true  // Allows overwriting existing files with the same name
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                return res.status(500).render('index', { error: 'Error uploading file to Supabase: ' + uploadError.message });
            }

            // Create a new folder root if it doesn't exist in Prisma DB for the current user
            const rootFolderName = 'root';
            let rootFolder = await prisma.folder.findFirst({ where: { name: rootFolderName, userId: req.user.id } });


            // Create a new file entry in the database
            const newFile = await prisma.file.create({
                data: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size,
                    filePath: data.path,  // Path to file in Supabase storage
                    location: rootFolder.filePath + '/' + req.file.originalname, // Use root folder's filePath
                    Folder: { connect: { id: rootFolder.id } },  // Connect to the root folder
                    user: { connect: { id: req.user.id } }
                }
            });

            // Step 4: Optionally, delete the file from the local disk (cleanup)
            await fs.unlink(filePath); // This will delete the file from 'uploads/' after uploading to Supabase

            // Redirect to success page or index
            res.redirect('/');  // Adjust as necessary

        } catch (dbError) {
            console.error('Database Error:', dbError);
            return res.status(500).render('index', { error: 'Error saving file information to the database.' });
        }
    });
};



exports.fileDownload = async (req, res) => {
    const fileId = req.params.id;

    try {
        // Fetch file information from the database
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        console.log('File path:', file.filePath);

        // console.log('Supabase access token:', req.session.supabaseAccessToken);
        // Ensure the session is available before calling getUser
        const accessToken = req.session.supabaseAccessToken;
        const refreshToken = req.session.supabaseRefreshToken;

        if (!accessToken || !refreshToken) {
            return res.status(401).send('User not authenticated');
        }

        // Set the session using the access and refresh tokens
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (sessionError) {
            console.error('Error setting Supabase session:', sessionError);
            return res.status(401).send('User not authenticated');
        }

        const accessTokenExpired = sessionError?.message === 'Invalid refresh token';
        if (accessTokenExpired) {
            const { data: newSession, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                return res.status(401).send('Session expired, please log in again.');
            }
            req.session.supabaseAccessToken = newSession.access_token;
            req.session.supabaseRefreshToken = newSession.refresh_token;
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error('Auth error:', authError);
        }
        console.log('Authenticated user role:', user.role);



        const { data: fileBlob, error: downloadError } = await supabase.storage
            .from('File-Upload-app')
            .download(file.filePath);



        if (downloadError) {
            console.error('Error downloading file:', downloadError.message);
            return res.status(500).send('Error downloading the file');
        }

        console.log('file stream:', fileBlob)
        // Convert the Blob to Buffer
        const buffer = await fileBlob.arrayBuffer(); // Convert blob to ArrayBuffer
        const bufferData = Buffer.from(buffer);      // Convert ArrayBuffer to Buffer

        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
        res.setHeader('Content-Type', file.fileType);
        res.setHeader('Content-Length', file.fileSize);

        res.end(bufferData);
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
            // fs.unlink(filePath, (err) => {
            //     if (err) {
            //         console.error('Error deleting file:', err);
            //         return res.status(500).send('Error deleting file');
            //     }

            // });
            const { data, error } = await supabase
                .storage
                .from('File-Upload-app')
                .remove(filePath)

            if (error) {
                console.error('Error deleting bucket:', error.message);
                return res.status(500).send('Error deleting bucket');
            } else {
                console.log('Bucket deleted successfully');
                // res.status(200).send('Bucket deleted successfully');
            }

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