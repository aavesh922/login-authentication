# TASK 4 – Login Authentication System

A responsive login and sign-up interface built with **HTML, CSS, and Vanilla JavaScript**.

## Features
- Login and account registration
- Email format and password validation
- Duplicate account prevention
- Password show/hide toggle
- SHA-256 password hashing with the browser Web Crypto API
- Login session persistence using localStorage
- Logout and responsive layout

## Run the project
1. Extract the ZIP file.
2. Open the project folder in VS Code.
3. Run `index.html` using the VS Code Live Server extension, or serve the folder from `localhost`.
4. Create an account, then log out and log back in to test authentication.

Web Crypto is generally available on HTTPS and localhost. If opening the file directly (`file://`) causes a crypto error, use Live Server.

## Important security note
This is a **front-end learning demo**, not production-ready authentication. User records and sessions are stored in browser localStorage, which users can inspect or modify. SHA-256 here demonstrates hashing only; production systems should use a backend, HTTPS, secure session cookies, rate limiting, and a password-hashing algorithm such as Argon2id, bcrypt, or scrypt. Never rely on client-side checks to protect real accounts.
