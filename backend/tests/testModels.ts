import { prisma } from './test_helpers';

export async function createTestResource(overrides = {}) {
    return await prisma.resource.create({
        data: {
            title: 'Test Resource',
            description: 'Test description',
            recourse_type: 'PDF',
            hosting_type: 'AWS',
            category_type: 'KIDS_EDUCATIONAL',
            age_range_min: 5,
            age_range_max: 10,
            time_to_read: 15,
            ...overrides
        }
    });
}

export async function createTestHostedResource(resourceId: number, overrides = {}) {
    return await prisma.hostedRecources.create({
        data: {
            id: resourceId,
            s3_key: BigInt(12345),
            ...overrides
        }
    });
}

export async function cleanupResources() {
    await prisma.hostedRecources.deleteMany();
    await prisma.resource.deleteMany();
}

beforeEach(async () => {
    await cleanupResources();
});