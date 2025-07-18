const express = require('express');
const multer = require('multer');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());

const uploads = multer({ dest: 'uploads/' });

app.post('/send-email', uploads.single('photo'), async (req, res) => {
  const { email } = req.body;
  const photoPath = req.file?.path;

  if (!email || !req.file) {
    return res.status(400).json({ message: 'Missing email or photo file' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Your PhotoBooth Picture',
      text: 'Here is your photo!',
      attachments: [
        {
          filename: 'photo.jpg',
          path: path.resolve(photoPath),
        },
      ],
    });

    console.log('Email sent:', info);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email:', error); // Add this
    return res.status(500).json({
      message: 'Failed to send email',
      error: error.message, // Add this
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
