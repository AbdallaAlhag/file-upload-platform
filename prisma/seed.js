const info = require('./info');
const prisma = require('../db/prisma');


async function main() {

    // // Reset the database
    // await prisma.$executeRaw`DELETE FROM public."RecentlyDeleted";`;
    // await prisma.$executeRaw`DELETE FROM public."Folder";`;
    // await prisma.$executeRaw`DELETE FROM public."File";`;
    // await prisma.$executeRaw`DELETE FROM public."User";`;

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


    // Create initial files for the guest user
    if (!info) {
        console.error('Cannot read properties of undefined (reading \'map\')');
        return;
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
