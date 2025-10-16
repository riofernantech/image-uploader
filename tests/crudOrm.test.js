import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

it('should prisma client', () => {
    expect(prisma).toBeDefined()
});

it('should be able to create customer', async () => {
    const user = await prisma.user.create({
        data: {
            email: "fernando@test.com",
            name: "Surya Fernando",
            password: "surya123",
            avatar: "default.png"
        }
    });

    expect(user.email).toBe("fernando@test.com");
    expect(user.name).toBe("Surya Fernando");
    expect(user.role).toBe("member");

});