
const authRouter = require('../../routes/auth');
const authService = require('../../services/authService');
jest.mock('../../services/authService');
jest.mock('../../config/passport', () => ({
    authenticate: () => (req, res, next) => {
        req.user = { _id: 'mockUserId' }; // thêm user giả vào request
        next();
    },
}));

const express = require('express');
const request = require('supertest');

const authApp = express();
authApp.use(express.json());
authApp.use('/auth', authRouter);

describe('[ROUTE] /auth', () => {
    it('POST /login with valid credentials should return tokens', async () => {
        authService.login.mockResolvedValue({
            accessToken: 'access',
            refreshToken: 'refresh',
        });
        const res = await request(authApp).post('/auth/login').send({
            email: 'test@example.com',
            password: '123456'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBe('access');
    });

    it('POST /login with missing fields should return 400', async () => {
        const res = await request(authApp).post('/auth/login').send({ email: '' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /register with missing fields should return 400', async () => {
        const res = await request(authApp).post('/auth/register').send({});
        expect(res.statusCode).toBe(400);
    });

    it('POST /register valid case should return 201', async () => {
        authService.register.mockResolvedValue();
        const res = await request(authApp).post('/auth/register').send({
            username: 'test',
            email: 'test@example.com',
            password: '123456'
        });
        expect(res.statusCode).toBe(201);
    });

    it('POST /refresh-token with no cookie should return 401', async () => {
        const res = await request(authApp).post('/auth/refresh-token');
        expect(res.statusCode).toBe(401);
    });

});
