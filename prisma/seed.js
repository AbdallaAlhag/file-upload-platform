const info = require('./info');
const prisma = require('../db/prisma');


async function main() {

    // Reset the database
    await prisma.$executeRaw`DELETE FROM public."RecentlyDeleted";`;
    await prisma.$executeRaw`DELETE FROM public."Folder";`;
    await prisma.$executeRaw`DELETE FROM public."File";`;
    await prisma.$executeRaw`DELETE FROM public."User";`;

    // Can't artificially create users since the password never gets hashed!!! unless we create that script -todo?
    // Create initial users
    // await prisma.user.createMany({
    //     data: [
    //         {
    //             username: 'guest',
    //             password: 'guestguest', // Ideally, use bcrypt to hash this
    //             email: 'guest@guest.com',
    //         },
    //     ],
    // });

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
