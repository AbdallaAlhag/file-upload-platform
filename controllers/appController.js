const prisma = require("../db/prisma");

// appController.js -> appRouter.js
exports.getHome = async (req, res) => {
    // Fetch user-specific folders
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });

    // Fetch files owned by the user
    const userFiles = await prisma.file.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
            location: true,
            starred: true
        },
        orderBy: {
            lastOpenedAt: 'desc'
        },
        where: {
            userId: req.user.id
        }
    });

    // Fetch files shared with the user
    const sharedFiles = await prisma.sharedFile.findMany({
        where: {
            userId: req.user.id
        },
        select: {
            file: {
                select: {
                    id: true,
                    fileName: true,
                    fileType: true,
                    lastOpenedAt: true,
                    user: true,
                    filePath: true,
                    location: true,
                    starred: true
                }
            }
        }
    });

    // Extract shared files' data
    const sharedFilesData = sharedFiles.map(shared => shared.file);

    // Combine user files and shared files
    const indexData = [...userFiles, ...sharedFilesData];

    // Sort combined indexData by starred (if needed) and lastOpenedAt
    indexData.sort((a, b) => (b.starred - a.starred) || (b.lastOpenedAt - a.lastOpenedAt));

    res.render('index', { indexData, folders });
};

exports.getFolder = async (req, res) => {

    const indexData = await prisma.folder.findMany({
        select: {
            id: true,
            name: true,
            files: true,
            user: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc'
        },
        where: {
            userId: req.user.id
        }
    });

    // Sort indexData by starred in descending order
    // indexData.sort((a, b) => (a.starred < b.starred) ? 1 : -1);
    res.render('folder', { indexData });
}

exports.getRecent = async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });
    const twoWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);
    const indexData = await prisma.file.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
            location: true,
            starred: true
        },
        where: {
            lastOpenedAt: {
                gt: twoWeeksAgo
            }
        },
        where: {
            userId: req.user.id
        },
        orderBy: {
            lastOpenedAt: 'desc'
        }
    });
    res.render('index', { indexData, folders });
}

exports.getStarred = async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });
    const indexData = await prisma.file.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
            location: true,
            starred: true
        },
        where: {
            starred: true,
            userId: req.user.id
        },
        orderBy: {
            lastOpenedAt: 'desc'
        }
    });
    res.render('index', { indexData, folders });
}

exports.getRecentlyDeleted = async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });
    const indexData = await prisma.recentlyDeleted.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            deletedAt: true,
            user: true,
            filePath: true,
        },
        where: {
            userId: req.user.id
        },
        orderBy: {
            deletedAt: 'desc'
        }

    });
    res.render('index', { indexData, folders });
}

exports.getShared = async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });

    // This query is getting all shared files for the current user
    // It works by searching the join table (sharedFile) for any records
    // where the userId matches the current user's ID
    // It then selects the file from the join table and returns the file's
    // id, fileName, fileType, user, and filePath
    const sharedFiles = await prisma.sharedFile.findMany({
        where: {
            userId: req.user.id // Now checking the join table for shared files
        },
        select: {
            file: {
                select: {
                    id: true,
                    fileName: true,
                    fileType: true,
                    user: true,
                    filePath: true,
                    lastOpenedAt: true,
                    location: true,
                    starred: true
                }
            }
        },
    });
    const indexData = sharedFiles.map(item => item.file);
    console.log(indexData)
    res.render('index', { indexData, folders });
};

exports.getSearch = async (req, res) => {
    // Log the search query to debug
    console.log(req.query.query);  // Make sure the correct query parameter is being used

    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id  // Fetch folders related to the logged-in user
        }
    });

    // Fetch files matching the search query and belonging to the current user
    const indexData = await prisma.file.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
            location: true,
            starred: true
        },
        where: {
            userId: req.user.id,  // Only fetch files belonging to the current user
            OR: [{
                fileName: {
                    contains: req.query.query,
                    mode: 'insensitive'  // Optional: makes the search case-insensitive
                }
            }, {
                location: {
                    contains: req.query.query,
                    mode: 'insensitive'
                }
            }]
        },
        orderBy: {
            lastOpenedAt: 'desc'  // Order by last opened date in descending order
        }
    });

    // Render the index page with the search results
    res.render('index', { indexData, folders });
};
