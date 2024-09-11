const prisma = require('./prisma');


async function main() {
    // Create initial users
    await prisma.user.createMany({
        data: [
            {
                username: 'john_doe',
                password: 'hashed_password_123', // Ideally, use bcrypt to hash this
                email: 'john@example.com',
            },
            {
                username: 'jane_doe',
                password: 'hashed_password_456',
                email: 'jane@example.com',
            },
        ],
    });

    // Create initial posts (for example)
    await prisma.post.create({
        data: {
            title: 'First Post',
            content: 'This is my first post!',
            userId: 1, // Reference to the first user
        },
    });

    console.log('Seed data has been added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
