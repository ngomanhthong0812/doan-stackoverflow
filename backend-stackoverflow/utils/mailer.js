const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // hoặc SMTP riêng nếu cần bảo mật cao hơn
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendWelcomeEmail = async (to, username) => {
    await transporter.sendMail({
        from: `"StackClone Team" <${process.env.EMAIL_USER}>`,
        to,
        subject: '🎉 Welcome to StackClone!',
        html: `
            <h2>Hello ${username}!</h2>
            <p>Welcome to StackClone — where you can ask and answer tech questions!</p>
        `
    });

    console.log(`📧 Welcome email sent to ${to}`);
    console.log(`🧑 User: ${username}`);
};
