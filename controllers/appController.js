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
            starred: true,
            fileSize: true
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
    res.render('folder', { indexData, title: '➤ Folders' });
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
            starred: true,
            fileSize: true
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
    res.render('index', { indexData, folders, title: '➤ Recent Files' });
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
            starred: true,
            fileSize: true
        },
        where: {
            starred: true,
            userId: req.user.id
        },
        orderBy: {
            lastOpenedAt: 'desc'
        }
    });
    res.render('index', { indexData, folders, title: '➤ Starred Files' });
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
            fileSize: true
        },
        where: {
            userId: req.user.id
        },
        orderBy: {
            deletedAt: 'desc'
        }

    });
    res.render('index', { indexData, folders, action: 'recentlyDeleted', title: '➤ Recently Deleted' });
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
    res.render('index', { indexData, folders, title: '➤ Shared Files' });
};

exports.getSearch = async (req, res) => {
    // Log the search query to debug
    // console.log(req.query.query);  // Make sure the correct query parameter is being used

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
            starred: true,
            fileSize: true
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
    res.render('index', { indexData, folders, title: '➤ Search Results' });
};


exports.getFilter = async (req, res) => {
    console.log('Entering filter controller');
    console.log('Query params:', req.query);  // Log incoming query params

    const { type, people, modified } = req.query;
    try {
        const filter = {};

        if (type) {
            filter.fileType = type;
        }

        if (people) {
            if (people === 'shared') {
                filter.userId = { not: req.user.id };
            }
            if (people === 'me') {
                filter.userId = req.user.id;
            } else {
                filter.OR = [
                    { userId: req.user.id },
                    { sharedWith: { none: {} } }
                ];
            }

        }

        // Get today's date and times
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        if (modified) {
            switch (modified) {
                case 'today':
                    filter.lastOpenedAt = {
                        gte: startOfToday,
                        lt: endOfToday
                    };
                    break;
                case 'week':
                    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    filter.lastOpenedAt = {
                        gte: oneWeekAgo.toISOString(),
                        lt: new Date().toISOString()
                    };
                    break;
                case 'month':
                    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    filter.lastOpenedAt = {
                        gte: oneMonthAgo.toISOString(),
                        lt: new Date().toISOString()
                    };
                    break;
                default:
                    break;
            }
        }


        // Fetch files based on filter
        const indexData = await prisma.file.findMany({
            where: filter,
            select: {
                id: true,
                fileName: true,
                fileType: true,
                lastOpenedAt: true,
                user: true,
                filePath: true,
                location: true,
                starred: true,
                fileSize: true
            },
            orderBy: {
                lastOpenedAt: 'desc'
            }
        });

        // Fetch folders
        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.id
            }
        });


        // Check if indexData or folders are empty or undefined
        if (!indexData || !folders) {
            throw new Error('Failed to fetch data for rendering');
        }

        res.render('index', { indexData, folders, title: '➤ Filtered Results' });
    } catch (error) {
        console.error('Error fetching filtered data:', error);  // Log any errors that occur
        res.status(500).send('Server Error');
    }
};

