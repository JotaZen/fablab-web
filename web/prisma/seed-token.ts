
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tokenValue = 'cFeSlpiSyAviOK7jk8FLbr3LBph5ypMOOcE5Xfhm';
    const SYSTEM_USER_ID = 'SYSTEM_CONFIG';
    const TOKEN_TYPE = 'VESSEL_API_TOKEN';

    console.log(`Seeding Vessel Token: ${tokenValue}`);

    const existing = await prisma.userToken.findFirst({
        where: {
            userId: SYSTEM_USER_ID,
            type: TOKEN_TYPE,
        },
    });

    if (existing) {
        console.log('Update existing token...');
        await prisma.userToken.update({
            where: { id: existing.id },
            data: { token: tokenValue },
        });
    } else {
        console.log('Creating new token...');
        await prisma.userToken.create({
            data: {
                userId: SYSTEM_USER_ID,
                type: TOKEN_TYPE,
                token: tokenValue,
            },
        });
    }

    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
