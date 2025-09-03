const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('[CONTROLLER] authController', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register()', () => {
        it('should return 400 if missing fields', async () => {
            const req = { body: {} };

            await authController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 201 if register success', async () => {
            const req = {
                body: { username: 'Ben', email: 'ben@mail.com', password: '123456' }
            };
            authService.register.mockResolvedValue();

            await authController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
        });
    });

    describe('login()', () => {
        it('should return 400 if missing email/password', async () => {
            const req = { body: { email: '', password: '' } };

            await authController.login(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return token if login success', async () => {
            const req = { body: { email: 'ben@mail.com', password: '123456' } };
            authService.login.mockResolvedValue({
                accessToken: 'access',
                refreshToken: 'refresh'
            });

            await authController.login(req, res, next);
            expect(res.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refresh',
                expect.objectContaining({ httpOnly: true })
            );
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'access' });
        });
    });

    describe('refreshAccessToken()', () => {
        it('should return 401 if no cookie', async () => {
            const req = { cookies: {} };

            await authController.refreshAccessToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return new access token if refresh token valid', async () => {
            const req = { cookies: { refreshToken: 'mockToken' } };
            authService.refreshToken.mockResolvedValue('newAccessToken');

            await authController.refreshAccessToken(req, res, next);
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'newAccessToken' });
        });
    });
});
