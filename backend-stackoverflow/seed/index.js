const bcrypt = require("bcrypt");
const User = require("../models/User");
const Badge = require("../models/Badge");
const Tag = require("../models/Tag");

async function seedData() {
  try {
    // ==== Seed admin mặc định ====
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin account created: admin@example.com / admin123");
    } else {
      console.log("Admin account already exists");
    }

    // ==== Seed badges mặc định ====
    const badges = [
      {
        type: "bronze",
        name: "Bronze Badge",
        description: "Earned 50 points",
        points: 50,
      },
      {
        type: "silver",
        name: "Silver Badge",
        description: "Earned 100 points",
        points: 100,
      },
      {
        type: "gold",
        name: "Gold Badge",
        description: "Earned 200 points",
        points: 200,
      },
    ];

    for (const b of badges) {
      const exists = await Badge.findOne({ type: b.type });
      if (!exists) {
        await Badge.create(b);
        console.log(`Badge created: ${b.name}`);
      } else {
        console.log(`Badge already exists: ${b.name}`);
      }
    }

    // ==== Seed tags mặc định ====
    const tags = [
      // JavaScript
      { name: "#javascript", description: "JavaScript cơ bản và nâng cao" },
      { name: "#lậptrìnhjavascript", description: "Học lập trình JavaScript" },
      { name: "#es6", description: "ES6 Features" },
      { name: "#es6javascript", description: "ES6 trong JavaScript" },
      { name: "#nodejs", description: "Node.js backend" },
      { name: "#lậptrìnhnodejs", description: "Lập trình Node.js" },
      { name: "#reactjs", description: "ReactJS frontend" },
      { name: "#lậptrìnhreact", description: "Học lập trình ReactJS" },

      // Data Structures
      { name: "#datastructure", description: "Data Structures" },
      { name: "#cấutrúcdữliệu", description: "Cấu trúc dữ liệu" },
      { name: "#array", description: "Arrays" },
      { name: "#mảng", description: "Mảng trong lập trình" },
      { name: "#linkedlist", description: "Linked Lists" },
      { name: "#danhsáchliênkết", description: "Danh sách liên kết" },
      { name: "#stack", description: "Stacks" },
      { name: "#ngănxếp", description: "Ngăn xếp" },
      { name: "#queue", description: "Queues" },
      { name: "#hàngđợi", description: "Hàng đợi" },
      { name: "#tree", description: "Trees" },
      { name: "#cây", description: "Cấu trúc cây" },
      { name: "#binarytree", description: "Binary Trees" },
      { name: "#câynhịphân", description: "Cây nhị phân" },
      { name: "#graph", description: "Graphs" },
      { name: "#đồthị", description: "Cấu trúc đồ thị" },
      { name: "#hashtable", description: "Hash Tables" },
      { name: "#bảnbăm", description: "Bảng băm" },

      // Algorithms
      { name: "#algorithm", description: "Algorithms" },
      { name: "#giảithuật", description: "Giải thuật" },
      { name: "#sorting", description: "Sorting algorithms" },
      { name: "#sắpxếp", description: "Thuật toán sắp xếp" },
      { name: "#searching", description: "Searching algorithms" },
      { name: "#tìmkiếm", description: "Thuật toán tìm kiếm" },
      { name: "#recursion", description: "Recursion" },
      { name: "#đệquy", description: "Đệ quy" },
      { name: "#dynamicprogramming", description: "Dynamic Programming" },
      { name: "#lậptrìnhđộng", description: "Lập trình động" },
      { name: "#greedy", description: "Greedy algorithms" },
      { name: "#thamlam", description: "Thuật toán tham lam" },
      { name: "#backtracking", description: "Backtracking" },
      { name: "#quaylui", description: "Thuật toán quay lui" },
      { name: "#divideandconquer", description: "Divide and Conquer" },
      { name: "#chiađểtrị", description: "Thuật toán chia để trị" },
    ];

    for (const t of tags) {
      const exists = await Tag.findOne({ name: t.name });
      if (!exists) {
        await Tag.create(t);
        console.log(`Tag created: ${t.name}`);
      }
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

module.exports = seedData;
