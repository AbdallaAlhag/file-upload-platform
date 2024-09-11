const prisma = require('./prisma');

// Fetch all users
const getAllUsers = async () => {
    return await prisma.user.findMany();
};

// Find user by ID
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: id },
    });
};

// Create a new user
const createUser = async (username, password, email) => {
    return await prisma.user.create({
        data: {
            username: username,
            password: password, // Ensure this is hashed before storing
            email: email,
        },
    });
};

// Update user by ID
const updateUser = async (id, data) => {
    return await prisma.user.update({
        where: { id: id },
        data: data,
    });
};

// Delete user by ID
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id: id },
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
