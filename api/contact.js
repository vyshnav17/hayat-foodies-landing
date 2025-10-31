import cors from 'cors';
import nodemailer from 'nodemailer';

const corsHandler = cors({
  origin: true,
  credentials: true
});

function wrapCors(handler) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve(handler(req, res));
      });
    });
  };
}

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Return empty array since Firebase is removed
        res.status(200).json([]);
        break;

      case 'POST':
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        try {
          // Create email transporter
          const transporter = createTransporter();

          // Email content
          const mailOptions = {
            from: `"Hayat Foods Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission - Hayat Foods',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                  New Contact Form Submission
                </h2>
                <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                  <p><strong>Message:</strong></p>
                  <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #f97316;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <p style="color: #666; font-size: 12px;">
                  This email was sent from the Hayat Foods website contact form.
                </p>
              </div>
            `,
            replyTo: email
          };

          // Send email
          await transporter.sendMail(mailOptions);

          console.log('Contact email sent successfully to:', process.env.ADMIN_EMAIL);
          res.status(201).json({
            message: 'Contact submission received and email sent successfully'
          });

        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          res.status(500).json({
            error: 'Contact submission received but email failed to send',
            details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
          });
        }
        break;

      case 'PUT':
        // No-op since Firebase is removed
        res.status(200).json({ message: 'Submission update ignored (Firebase removed)' });
        break;

      case 'DELETE':
        // No-op since Firebase is removed
        res.status(200).json({ message: 'Submission deletion ignored (Firebase removed)' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default wrapCors(handler);
