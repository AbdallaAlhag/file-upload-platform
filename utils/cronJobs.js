const cron = require('node-cron');
const prisma = require("../db/prisma");


const setupCronJobs = () => {
    // Schedule to run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        try {
            await prismaClient.recentlyDeleted.deleteMany({
                where: {
                    deletedAt: {
                        lt: thirtyDaysAgo
                    }
                }
            });
            console.log('Deleted files older than 30 days');
        } catch (err) {
            console.error('Error deleting old files:', err);
        }
    });
};

module.exports = setupCronJobs;
