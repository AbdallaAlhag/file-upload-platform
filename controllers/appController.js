const prisma = require("../db/prisma");

// appController.js -> appRouter.js
exports.getHome = async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id
        }
    });
    // fetch all the folders that the user has created
    // and pass them to the home page so that the user can
    // see them in the sidebar

    // fetch all the files that are not in a folder
    // and pass them to the home page so that the user can
    // see them in the main area of the page
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
        orderBy: {
            // starred: 'desc',
            lastOpenedAt: 'desc'
        },
        where: {
            OR: [
                { userId: req.user.id },
                { sharedWith: { some: { email: req.user.email } } }
            ],
        },
    });

    // Sort indexData by starred in descending order
    // indexData.sort((a, b) => (a.starred < b.starred) ? 1 : -1);
    res.render('index', { indexData, folders });

}

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

