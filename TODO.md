# TODO: Change Admin Email for Contact Form

## Tasks to Complete

- [ ] Update local .env file: Change ADMIN_EMAIL from "v17vyshnavtv@gmail.com" to "abhishekkochi7@gmail.com"
- [ ] Update Vercel environment variables: In Vercel dashboard, set ADMIN_EMAIL to "abhishekkochi7@gmail.com" for production
- [ ] Test contact form submission to verify emails are sent to the new admin email address
- [ ] Redeploy on Vercel if environment variable update requires it

## Notes
- The contact form code in api/contact.js already uses process.env.ADMIN_EMAIL, so no code changes are needed.
- Local development will use the .env file.
- Production uses Vercel environment variables.
