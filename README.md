# Pulse

A frontend-only portfolio dashboard built with React, TypeScript, Vite and Tailwind CSS.

## Included

- Local register/login flow
- Password hashing in the browser with Web Crypto (PBKDF2 + salt)
- Protected routes
- Persistent local session
- Fixed sidebar and fixed header
- Dashboard shell with React Router Outlet
- Resume Builder starter screen with live preview
- Profile and password change screen
- Logout
- Light / dark themes
- Neumorphism + glassmorphism visual language
- Responsive sidebar
- Placeholder Members / Analytics / Components pages
- About Me page

## Important authentication note

This project has no backend. Authentication is only a portfolio/demo implementation. Passwords are not stored as plaintext, but browser-side storage is not a replacement for server-side authentication in production.

## Run

```bash
npm install
npm run dev
```

If you already installed the dependencies in your existing Pulse project, you can also copy only `src`, `index.html`, `vite.config.ts` and the TypeScript config files.

## Current routes

- `/login`
- `/dashboard`
- `/resume`
- `/members`
- `/analytics`
- `/components`
- `/profile`
- `/about`
