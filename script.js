const prisma = require('./db/prisma');


async function main() {
    // Example: Create a new file entry
    const newFile = await prisma.file.create({
        data: {
            filename: 'example.pdf',
            filepath: '/uploads/example.pdf',
        },
    });

    console.log('File uploaded:', newFile);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
