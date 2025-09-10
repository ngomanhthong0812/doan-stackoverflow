const Badge = require("../models/Badge");
const User = require("../models/User");

exports.checkAndAwardBadges = async function (userId) {
  const user = await User.findById(userId).populate("badges");
  if (!user) return;

  const allBadges = await Badge.find();

  for (const badge of allBadges) {
    const shouldHave = Math.floor(user.reputation / badge.points);

    // Số lượng hiện tại đã có
    const hasCount = user.badges.filter((b) => b.type === badge.type).length;

    // Thêm badge còn thiếu
    for (let i = hasCount; i < shouldHave; i++) {
      user.badges.push(badge._id);
    }
  }

  await user.save();
};
