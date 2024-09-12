const prisma = require("../db/prisma");

// appController.js -> appRouter.js
exports.getHome = async (req, res) => {
    const indexData = await prisma.file.findMany({
        select: {
            fileName: true,
            fileType: true,
            lastOpenedAt: true,
            user: true,
            filePath: true,
        },
    });

    // console.log(indexData);
    res.render('index', { indexData });
}