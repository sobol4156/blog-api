## Blog API (Node.js, Express, TypeScript, MongoDB)

A production-ready REST API for a blogging platform built with Express + TypeScript and MongoDB. It provides authentication, blog CRUD, comments, likes, users management, file uploads (banner images via Cloudinary), request validation, rate limiting, and structured logging.

### Tech stack
- Node.js, Express, TypeScript
- MongoDB + Mongoose
- JWT authentication (access + refresh tokens)
- Multer for multipart/form-data
- Cloudinary for image storage
- express-validator for input validation
- express-rate-limit for basic DoS protection
- winston for structured logging

### Key features
- Auth: register, login, refresh token, logout
- Blogs: create, read, update, delete, list, list by user
- Comments: create, read by id, read by blog, delete
- Likes: like/unlike a blog
- Users: admin listing, get/delete by id, self profile read/update/delete
- File upload for blog banner images with Cloudinary
- Role-based authorization (admin, user)
- Centralized validation and error handling

## Project structure
```
src/
  config/                 # App configuration
  controllers/            # Route handlers (by domain and version)
  lib/                    # Integrations (cloudinary, jwt, mongoose, logger, rate limit)
  middlewares/            # Auth, authorization, upload, validation error
  models/                 # Mongoose models (blog, comment, like, token, user)
  routes/
    v1/                   # Versioned API routes
  server.ts               # App bootstrap
```
Compiled JavaScript is emitted into `dist/`.

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB (local or managed, e.g. Atlas)
- Cloudinary account (for banner images)

### Installation
```bash
npm install
```

### Environment
Create `.env` in the project root with the following variables (example):
```bash
# Server
PORT=4000
NODE_ENV=development

# Mongo
MONGODB_URI=mongodb://localhost:27017/blog_api

# JWT
JWT_ACCESS_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run (development)
```bash
npm run dev
```
Starts the server with Nodemon + ts-node.

### Build
```bash
npm run build
```

### Run (production)
```bash
npm start
```
Uses compiled code from `dist/`.

### Docker (optional)
There is a `docker-compose.yml` available. Ensure your `.env` is configured, then:
```bash
docker-compose up --build -d
```

## Base URL and versioning
- Base path: `/v1`
- Healthcheck: `GET /v1` → returns status/version

## Authentication
- JWT (access + refresh tokens)
- Access token is used via `Authorization: Bearer <token>`
- Refresh token is stored in `httpOnly` cookie `refreshToken`

## Routes overview

All endpoints below are prefixed with `/v1`.

### Auth (`/auth`)
- `POST /auth/register` — Register user
- `POST /auth/login` — Login
- `POST /auth/refresh-token` — Refresh access token (uses cookie)
- `POST /auth/logout` — Logout (requires auth)

### Users (`/users`)
- `GET /users` — List users (admin)
- `GET /users/:userId` — Get user by ID (admin)
- `DELETE /users/:userId` — Delete user by ID (admin)
- `GET /users/current` — Get current user (admin, user)
- `PUT /users/current` — Update current user (admin, user)
- `DELETE /users/current` — Delete current user (admin, user)

### Blogs (`/blogs`)
- `POST /blogs` — Create blog (admin, user). Multipart: `banner_image` (file)
- `GET /blogs` — List blogs (admin, user) with `limit`, `offset`
- `GET /blogs/user/:userId` — List blogs by user (admin, user)
- `GET /blogs/:slug` — Get blog by slug (admin, user)
- `PUT /blogs/:blogId` — Update blog (admin, user). Multipart: `banner_image` (file)
- `DELETE /blogs/:blogId` — Delete blog (admin, user)

### Comments (`/comments`)
- `GET /comments/blog/:blogId` — List comments for a blog (admin, user)
- `GET /comments/:commentId` — Get comment by ID (admin, user)
- `POST /comments/blog/:blogId` — Create comment (admin, user)
- `DELETE /comments/blog/:commentId` — Delete comment (admin, user)

### Likes (`/likes`)
- `POST /likes/blog/:blogId` — Like a blog (admin, user)
- `DELETE /likes/blog/:blogId` — Unlike a blog (admin, user)

## Validation & errors
Input validation is done with `express-validator`. Validation errors are normalized by the `validationError` middleware.

Typical error response:
```json
{
  "message": "Validation error",
  "errors": [
    { "param": "email", "msg": "Email is required" }
  ]
}
```

## Rate limiting & security
- Basic rate limiting with `express-rate-limit` (see `src/lib/express_rate_limit.ts`)
- Always use HTTPS in production and secure cookies for refresh tokens

## File uploads
- Banner images for blogs are uploaded via Multer and stored on Cloudinary
- See `src/middlewares/uploadBlogBanner.ts` and `src/lib/cloudinary.ts`

## Logging
- Structured logging via `winston` (`src/lib/winston.ts`)

## Example requests

Register:
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

Login:
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

Create blog (multipart):
```bash
curl -X POST http://localhost:4000/v1/blogs \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "title=My first blog" \
  -F "content=Hello world" \
  -F "status=published" \
  -F "banner_image=@/path/to/image.jpg"
```

## Development notes
- The code is compiled to `dist/`. Do not edit `dist/` manually.
- Add new endpoints under `src/routes/v1` and corresponding controllers under `src/controllers/v1`.
- Keep validation close to route definitions; keep controllers focused on business logic.

## OpenAPI/Swagger (optional)
If desired, we can expose interactive API docs using `swagger-ui-express` and an OpenAPI spec. Feel free to request this and it will be added.

## License
Unlicensed for now. Add your preferred license before production.


