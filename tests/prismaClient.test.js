import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

it('should prisma client', () => {
    expect(prisma).toBeDefined()
});

it('should query all user', async () => {
    // await prisma.$connect()
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
    // await prisma.$disconnect()
});

it('should be able to execute sql', async () => {
    const email = "riofernando@gmail.com";
    const name = "Rio Fernando";
    const password = "rio12345";
    const role = "member";
    const avatar = "default.png";

    const impacted = await prisma.$executeRaw`INSERT INTO users(email, name, password, role, avatar) VALUES (${email}, ${name}, ${password}, ${role}, ${avatar});`;
    expect(impacted).toBe(1);
});

it('should be able to query sql', async () => {
    const id = "1";

    const user = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${id}`;

    for (const sample of user) {
        console.info(`Result sample id : ${sample.id} and name ${sample.name}`);
    }
});