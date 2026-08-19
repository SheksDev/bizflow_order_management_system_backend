import { prisma } from "@/config/prisma.js"
import app from "./app.js";
import { env } from "./config/env.js";
import { API_V1 } from "./app.js";

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

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 API (v1): ${API_V1}`);
    console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
    // console.log(`📊 Reports API: ${API_V1}/reports`);
    // console.log(`⏰ Reminders API: ${API_V1}/reminders`);
    // console.log(`❤️ Health Check: ${API_V1}/health`);
});