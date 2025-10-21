import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

export const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'error',
        }
    ],
});

prismaClient.$on('error', (e) => {
    logger.error(e);
});