const authService = require('../../services/authService');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../../utils/mailer');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/mailer');
jest.mock('../../utils/jwt');

describe('authService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------- REGISTER --------
    describe('register', () => {
        it('should hash password, create user, and send welcome email', async () => {
            const input = { username: 'test', email: 'test@example.com', password: '123456' };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpass');
            User.create.mockResolvedValue({ ...input, password: 'hashedpass' });

            const result = await authService.register(input);

            expect(User.findOne).toHaveBeenCalledWith({ email: input.email });
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
            expect(User.create).toHaveBeenCalledWith({
                username: 'test',
                email: 'test@example.com',
                password: 'hashedpass',
            });
            expect(sendWelcomeEmail).toHaveBeenCalledWith(input.email, input.username);
            expect(result).toEqual(expect.objectContaining({ email: input.email }));
        });

        it('should throw error if email already exists', async () => {
            User.findOne.mockResolvedValue({ _id: 'exists' });

            await expect(authService.register({
                username: 'test',
                email: 'test@example.com',
                password: '123456'
            })).rejects.toThrow('Email already exists');
        });
    });

    // -------- LOGIN --------
    describe('login', () => {
        it('should validate password and return tokens', async () => {
            const user = { _id: 'u123', email: 'test@example.com', password: 'hashed' };
            const input = { email: user.email, password: '123456' };

            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            generateAccessToken.mockReturnValue('access_token');
            generateRefreshToken.mockReturnValue('refresh_token');

            const result = await authService.login(input);

            expect(User.findOne).toHaveBeenCalledWith({ email: input.email });
            expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
            expect(result).toEqual({
                accessToken: 'access_token',
                refreshToken: 'refresh_token'
            });
        });

        it('should throw error if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            await expect(authService.login({
                email: 'notfound@example.com',
                password: '123456'
            })).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password is incorrect', async () => {
            User.findOne.mockResolvedValue({ _id: 'u1', email: 'test@example.com', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login({
                email: 'test@example.com',
                password: 'wrongpass'
            })).rejects.toThrow('Invalid credentials');
        });
    });

    // -------- REFRESH TOKEN --------
    describe('refreshToken', () => {
        it('should verify refresh token and return new access token', async () => {
            const userId = 'u123';
            const user = { _id: userId, username: 'test' };

            jwt.verify.mockReturnValue({ id: userId });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(user)
            });
            generateAccessToken.mockReturnValue('new_access_token');

            const result = await authService.refreshToken('valid_refresh_token');

            expect(jwt.verify).toHaveBeenCalledWith('valid_refresh_token', process.env.JWT_REFRESH_SECRET);
            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(result).toBe('new_access_token');
        });

        it('should throw error if refresh token is invalid', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('invalid token'); });

            await expect(authService.refreshToken('bad_token')).rejects.toThrow('invalid token');
        });

        it('should throw error if user not found', async () => {
            jwt.verify.mockReturnValue({ id: 'u123' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await expect(authService.refreshToken('valid_token')).rejects.toThrow('User not found');
        });
    });
});
