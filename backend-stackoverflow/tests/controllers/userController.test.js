const userController = require('../../controllers/userController');
const userService = require('../../services/userService');

jest.mock('../../services/userService');

describe('[CONTROLLER] userController', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ✅ getProfile
    describe('getProfile', () => {
        it('should return 401 if not authenticated', async () => {
            const req = {};
            await userController.getProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return user if authenticated', async () => {
            const req = { user: { _id: 'u1', username: 'Ben' } };
            await userController.getProfile(req, res, next);
            expect(res.json).toHaveBeenCalledWith(req.user);
        });
    });

    // ✅ getAllUsers
    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [{ username: 'A' }, { username: 'B' }];
            userService.getAllUsers.mockResolvedValue(users);
            await userController.getAllUsers({}, res, next);
            expect(res.json).toHaveBeenCalledWith(users);
        });
    });

    // ✅ getUserById
    describe('getUserById', () => {
        it('should return 403 if not admin or owner', async () => {
            const req = {
                user: { _id: 'u2', role: 'user' },
                params: { id: 'u1' }
            };
            await userController.getUserById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 404 if user not found', async () => {
            const req = {
                user: { _id: 'admin', role: 'admin' },
                params: { id: 'u3' }
            };
            userService.getUserById.mockResolvedValue(null);
            await userController.getUserById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return user if found and authorized', async () => {
            const user = { _id: 'u3', username: 'Ben' };
            const req = {
                user: { _id: 'u3', role: 'user' },
                params: { id: 'u3' }
            };
            userService.getUserById.mockResolvedValue(user);
            await userController.getUserById(req, res, next);
            expect(res.json).toHaveBeenCalledWith(user);
        });
    });

    // ✅ createUser
    describe('createUser', () => {
        it('should return 400 if missing required fields', async () => {
            const req = { body: {} };
            await userController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should create user and return 201', async () => {
            const req = {
                body: {
                    username: 'ben',
                    email: 'ben@mail.com',
                    password: '123456',
                    role: 'user'
                },
                file: { path: 'cloudinary.com/avatar.jpg' }
            };
            const newUser = { _id: 'u1', ...req.body, avatar: req.file.path };
            userService.createUser.mockResolvedValue(newUser);

            await userController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });
    });

    // ✅ updateUser
    describe('updateUser', () => {
        it('should return 404 if user not found', async () => {
            const req = { params: { id: 'u1' }, body: {} };
            userService.updateUser.mockResolvedValue(null);

            await userController.updateUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should update and return user', async () => {
            const req = {
                params: { id: 'u1' },
                body: { username: 'new' },
                file: { path: 'img.jpg' }
            };
            const updated = { _id: 'u1', username: 'new', avatar: 'img.jpg' };
            userService.updateUser.mockResolvedValue(updated);

            await userController.updateUser(req, res, next);
            expect(res.json).toHaveBeenCalledWith(updated);
        });
    });

    // ✅ deleteUser
    describe('deleteUser', () => {
        it('should return 400 if userId missing', async () => {
            const req = { body: {} };
            await userController.deleteUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 404 if user not found', async () => {
            const req = { body: { userId: 'u99' } };
            userService.deleteUser.mockResolvedValue(null);
            await userController.deleteUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should delete and return success message', async () => {
            const req = { body: { userId: 'u1' } };
            userService.deleteUser.mockResolvedValue({ _id: 'u1' });

            await userController.deleteUser(req, res, next);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    });
});
