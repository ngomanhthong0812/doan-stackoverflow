const User = require('../models/User');
const bcrypt = require('bcrypt');
const cache = require('../services/cacheService');
const cacheKeys = require('../utils/cacheKeys');
const redis = require('../utils/redis');

exports.getUserById = async (id) => {
    return User.findById(id).select('-password');
};

exports.getAllUsers = async () => {
    const cached = await cache.get(cacheKeys.allUsers);
    if (cached) return cached;

    const users = await User.find().select('-password');
    await cache.set(cacheKeys.allUsers, users, 120);
    return users;
};

exports.createUser = async ({ username, email, password, role, avatar }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
        avatar: avatar || null
    });
    const savedUser = await user.save();
    await cache.del(cacheKeys.allUsers);
    return savedUser;
};

exports.updateUser = async (id, userData) => {
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    await cache.del(cacheKeys.allUsers);
    return updatedUser;

};

exports.deleteUser = async (id) => {
    const deleteUser = await User.findByIdAndDelete(id);
    await cache.del(cacheKeys.allUsers);

    return deleteUser;
};

exports.toggleFollow = async (currentUserId, targetUserId) => {
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new Error('CANNOT_FOLLOW_SELF');
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) throw new Error('USER_NOT_FOUND');

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // Bỏ follow
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
    } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return { followed: !isFollowing };
};

exports.getPublicProfile = async (userId) => {
    const key = cacheKeys.publicProfile(userId);
    const cached = await cache.get(key);
    if (cached) return cached;

    const user = await User.findById(userId)
        .select('username avatar reputation followers following createdAt');
    if (!user) throw new Error('USER_NOT_FOUND');

    const Profile_Public = {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        reputation: user.reputation,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        createdAt: user.createdAt
    };

    await cache.set(key, Profile_Public, 120); // TTL: 2 phút
    return Profile_Public

};
exports.logout = async (userId) => {
    await redis.del(cacheKeys.refreshToken(userId));
};