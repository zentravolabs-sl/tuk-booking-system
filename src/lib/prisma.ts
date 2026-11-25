import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

  // Automatic retry middleware for Neon Serverless cold-start wakeups & idle socket drops
  client.$use(async (params, next) => {
    const maxRetries = 3;
    let attempt = 0;

    while (true) {
      try {
        return await next(params);
      } catch (error: any) {
        attempt += 1;
        const message = String(error?.message || "");
        const isTransientConnectionError =
          message.includes("Can't reach database server") ||
          message.includes("Timed out fetching a new connection") ||
          message.includes("Server has closed the connection") ||
          message.includes("ConnectionReset") ||
          error?.code === "P1001" ||
          error?.code === "P1002" ||
          error?.code === "P1017";

        if (!isTransientConnectionError || attempt >= maxRetries) {
          throw error;
        }

        // Wait briefly while Neon wakes up the compute endpoint, then retry transparently
        await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
      }
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
