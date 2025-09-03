const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const userService = require('../../services/userService');

jest.mock('../../services/userService');

// ✅ Mock auth middleware
jest.mock('../../middlewares/authMiddleware', () => (req, res, next) => {
    req.user = { _id: 'u123', username: 'TestUser', role: 'user' };
    next();
});

const app = express();
app.use(express.json());
app.set('io', { emit: jest.fn() }); // ✅ Thêm dòng này
app.use('/user', userRouter);

describe('[ROUTE] /user', () => {
    afterEach(() => jest.clearAllMocks());

    it('GET /profile should return current user', async () => {
        const res = await request(app).get('/user/profile');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({ username: 'TestUser' }));
    });

    it('GET / should return all users', async () => {
        const mockUsers = [{ username: 'A' }, { username: 'B' }];
        userService.getAllUsers.mockResolvedValue(mockUsers);

        const res = await request(app).get('/user');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('GET /:id should return user by id (authorized)', async () => {
        const mockUser = { _id: 'u123', username: 'Ben' };
        userService.getUserById.mockResolvedValue(mockUser);

        const res = await request(app).get('/user/u123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUser);
    });
});
