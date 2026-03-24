const transporter = require('../utils/mail');
async function sendWelcomeEmail(user) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to Our Service',
        text: `Hello ${user.name},\n\nThank you for registering with our service! We're excited to have you on board.\n\nBest regards,\nThe Team`
    };
    try{
        await transporter.sendMail(mailOptions);
    }catch(error){
        console.error('Error sending welcome email:', error);
    }
}

module.exports = {
    sendWelcomeEmail
}