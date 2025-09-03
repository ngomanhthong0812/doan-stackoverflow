
const userService = require('../services/userService');

exports.getHello = (req, res) => {
    res.json({ message: 'Hello from user controller!' });
};

exports.getProfile = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const user = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();

        if (req.app?.get) {
            const io = req.app.get('io');
            io.emit("viewNotice", "có người xem bạn");
        }

        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await userService.createUser({
            username,
            email,
            password,
            role,
            avatar: req.file?.path || null
        });

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        // multer-storage-cloudinary đã upload xong → có sẵn URL
        if (req.file) {
            req.body.avatar = req.file.path; // Cloudinary trả về .path là URL
        }

        const updated = await userService.updateUser(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const deleted = await userService.deleteUser(userId);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.toggleFollow = async (req, res, next) => {
    try {
        const targetUserId = req.params.id;
        const result = await userService.toggleFollow(req.user._id, targetUserId);
        res.json(result);
    } catch (err) {
        if (err.message === 'CANNOT_FOLLOW_SELF') {
            return res.status(400).json({ message: 'Bạn không thể tự follow chính mình.' });
        }
        if (err.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        next(err);
    }
};

exports.getPublicProfile = async (req, res, next) => {
    try {
        const profile = await userService.getPublicProfile(req.params.id);
        res.json(profile);
    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'User not found' });
        }
        next(err);
    }
};

