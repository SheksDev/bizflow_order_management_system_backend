import { prisma } from "@/config/prisma.js"
import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});