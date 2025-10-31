# TODO: Add Email Functionality to Contact Form

## Tasks
- [x] Add nodemailer dependency to package.json
- [x] Update api/contact.js to send emails via Gmail SMTP on POST requests
- [x] Modify Contact.tsx to send form data to /api/contact API instead of localStorage
- [x] Create .env.example with required environment variables
- [x] Verify Gmail SMTP transporter works with provided credentials
- [ ] Set environment variables in Vercel dashboard:
  - EMAIL_USER=vyshnavwhatsapp17@gmail.com
  - EMAIL_APP_PASSWORD=nvracdedbiqhhodq
  - ADMIN_EMAIL=v17vyshnavtv@gmail.com
- [ ] Test email functionality on deployed site
- [ ] Update TODO.md to mark all tasks complete
