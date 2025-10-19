import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // clear data before each test so they don't interfere
  await prisma.resources.deleteMany();
});

describe('Resource Routes Integration Tests', () => {
  const sampleResource = {
    title: 'Parenting Article',
    description: 'A test article for parents.',
    resource_type_fk: 1,
    hosting_type_fk: 2,
    category_fk: 3,
  };

  // CREATE
  it('POST /api/resources → should create a new resource', async () => {
    const res = await request(app).post('/api/resources').send(sampleResource);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(sampleResource.title);
    expect(res.body.id).toBeDefined();

    // verify DB insert
    const dbResource = await prisma.resources.findUnique({ where: { id: res.body.id } });
    expect(dbResource).not.toBeNull();
    expect(dbResource?.title).toBe(sampleResource.title);
  });

  // READ ALL
  it('GET /api/resources → should return all resources', async () => {
    await prisma.resources.create({ data: sampleResource });

    const res = await request(app).get('/api/resources');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe(sampleResource.title);
  });

  // READ BY ID
  it('GET /api/resources/:id → should return a specific resource', async () => {
    const created = await prisma.resources.create({ data: sampleResource });
    const res = await request(app).get(`/api/resources/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
    expect(res.body.title).toBe(sampleResource.title);
  });

  it('GET /api/resources/:id → should return 404 if not found', async () => {
    const res = await request(app).get('/api/resources/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Resource not found');
  });

  // UPDATE
  it('PUT /api/resources/:id → should update a resource', async () => {
    const created = await prisma.resources.create({ data: sampleResource });
    const res = await request(app)
      .put(`/api/resources/${created.id}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');

    const dbCheck = await prisma.resources.findUnique({ where: { id: created.id } });
    expect(dbCheck?.title).toBe('Updated Title');
  });

  it('PUT /api/resources/:id → should return 404 if resource not found', async () => {
    const res = await request(app).put('/api/resources/9999').send({ title: 'Nope' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Resource not found');
  });

  // DELETE
  it('DELETE /api/resources/:id → should delete a resource', async () => {
    const created = await prisma.resources.create({ data: sampleResource });
    const res = await request(app).delete(`/api/resources/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Resource deleted successfully');

    const dbCheck = await prisma.resources.findUnique({ where: { id: created.id } });
    expect(dbCheck).toBeNull();
  });

  it('DELETE /api/resources/:id → should return 404 if resource not found', async () => {
    const res = await request(app).delete('/api/resources/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Resource not found');
  });
});
