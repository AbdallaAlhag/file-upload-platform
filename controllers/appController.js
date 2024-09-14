const prisma = require("../db/prisma");

// appController.js -> appRouter.js
exports.getHome = async (req, res) => {
    const indexData = await prisma.file.findMany({
        select: {
            id: true,
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
            starred: true
        },
        orderBy: {
            // starred: 'desc',
            lastOpenedAt: 'desc'
        }
    });


    // Sort indexData by starred in descending order
    // indexData.sort((a, b) => (a.starred < b.starred) ? 1 : -1);
    res.render('index', { indexData });
}