const prisma = require('../db/prisma');


async function main() {

    // Reset the database
    await prisma.$executeRaw`DELETE FROM public."RecentlyDeleted";`;
    await prisma.$executeRaw`DELETE FROM public."Folder";`;
    await prisma.$executeRaw`DELETE FROM public."File";`;
    await prisma.$executeRaw`DELETE FROM public."User";`;
    // Create initial users
    // await prisma.user.createMany({
    //     data: [
    //         {
    //             username: 'test',
    //             password: 'test', // Ideally, use bcrypt to hash this
    //             email: 'test@test.com',
    //         },
    //         {
    //             username: 'guest',
    //             password: 'guest',
    //             email: 'guest@guest.com',
    //         },
    //     ],
    // });

    console.log('Data has be reset.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
