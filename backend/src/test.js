import prisma from "./config/db.js";

const users = await prisma.user.findMany();

console.log(users);

await prisma.$disconnect();