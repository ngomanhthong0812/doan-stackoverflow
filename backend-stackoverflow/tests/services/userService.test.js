const userService = require('../../services/userService');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const redis = require('../../utils/redis');

jest.mock('../../models/User');
jest.mock('bcrypt');

// ✅ MOCK redis để tránh lỗi khi test
jest.mock('../../utils/redis', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    close: jest.fn() // để tránh lỗi nếu bạn gọi redis.close()

}));

describe('userService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return users without passwords', async () => {
            const fakeUsers = [
                { _id: '1', username: 'Alice', email: 'a@example.com' },
                { _id: '2', username: 'Bob', email: 'b@example.com' }
            ];
            User.find.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUsers) });

            const users = await userService.getAllUsers();
            expect(users).toEqual(fakeUsers);
            expect(User.find).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should hash password and create user with default role and avatar', async () => {
            const input = {
                username: 'test',
                email: 'test@example.com',
                password: '123456',
            };

            const hashed = 'hashedpassword';

            const expectedSavedUser = {
                username: 'test',
                email: 'test@example.com',
                password: hashed,
                role: 'user',
                avatar: null,
            };

            bcrypt.hash.mockResolvedValue(hashed);

            const mockSave = jest.fn().mockResolvedValue(expectedSavedUser);
            User.mockImplementation(() => ({
                save: mockSave,
            }));

            const result = await userService.createUser(input);

            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
            expect(result).toEqual(expectedSavedUser);
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update and return user without password', async () => {
            const userId = 'abc123';
            const newData = { username: 'newname' };
            const updatedUser = { _id: userId, ...newData };

            User.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser)
            });

            const result = await userService.updateUser(userId, newData);
            expect(result).toEqual(updatedUser);
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, newData, { new: true });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            const userId = 'abc123';
            User.findByIdAndDelete.mockResolvedValue({ _id: userId });

            const result = await userService.deleteUser(userId);
            expect(result).toEqual({ _id: userId });
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
        });
    });

    describe('getUserById', () => {
        it('should return user without password', async () => {
            const fakeUser = { _id: 'u123', username: 'alice' };
            User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

            const result = await userService.getUserById('u123');

            expect(User.findById).toHaveBeenCalledWith('u123');
            expect(result).toEqual(fakeUser);
        });
    });

    afterAll(async () => {
        await redis.close(); // gọi hàm đã định nghĩa
    });
});
