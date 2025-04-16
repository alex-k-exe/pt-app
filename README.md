
# PT App

This is a full-stack web app I made for my Computer Science IA as part of the International Baccalaureate Diploma Program.
I used to host it at pt-app.pages.dev but I've now archived it

![Workouts](https://github.com/user-attachments/assets/963c756c-2fa2-4e45-bb92-37ed05cb4874)
![Signup](https://github.com/user-attachments/assets/836e9b78-f958-4cae-b122-0227cf5cfd26)
![Clients](https://github.com/user-attachments/assets/61e55d84-ab71-4a82-9154-97d6bdd4c761)

## Tech stack

[Svelte](https://svelte.dev/) - JavaScript framework
Typescript
[Cloudflare Pages](https://pages.cloudflare.com/) and [Cloudflare D1](https://developers.cloudflare.com/d1/)
- Back when I was properly running the app I hosted it with Cloudflare
- This let me easily interact with a SQLite database through D1

[Drizzle](https://orm.drizzle.team/) - typesafe ORM that lets me safely query the database
[Lucia](https://v3.lucia-auth.com/) - authentication

4 million libraries that are now all outdated and deprecated because web development ya know?

## Features

Authentication
Session management through cookies
Dark and light mode (it matches the default setting for your OS)
Responsive and accessible interface
Data validation

## Locally using the app

### Setup
Using Docker
```
docker build -t pt-app
docker run -p 3000:3000 pt-app
# Open `localhost:3000` in your browser
```
Manual build
```
npm install --legacy-peer-deps
npm run build
npx drizzle-kit generate && npx drizzle-kit migrate
npm run preview
# Open `localhost:4173` in your browser
```

### Logging in

| User    | Email                  | Password         |
| ------- | ---------------------- | ---------------- |
| Trainer | arnie@gmail.com        | `uTkOK5#4o3Xmp8` |
| Client  | alexkammin@outlook.com | `JTw*DtS4rFsI1*` |

To sign up as a new client:

1. Use the Clients page to create a new signup token
2. Open the web app again in a different browser or use incognito mode to avoid getting redirected due to cookies
3. Sign up with the token

## Project structure
```
12 billion config files
src
	lib
		components
		server - cannot be used by the client
		utils
	routes - files that make the actual web pages
		entry - signup and login
		main - only accessible once signed in
static
```
