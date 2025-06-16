const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info@dietdeli.vn',       // Email từ Google Workspace
    pass: 'htrncgbobfdidoli',                // App Password (16 ký tự, không có dấu cách)
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: '"Diet Deli" <infol@dietdeli.vn>',
      to,
      subject,
      html: htmlContent
    });
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = { sendEmail };