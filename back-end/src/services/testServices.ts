import { prisma } from '../database.js';

export async function resetRecommendations() {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
}