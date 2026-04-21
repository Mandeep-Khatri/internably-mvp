# Internably MVP Monorepo

Official mobile-first MVP for **Internably** - "The College Student Network".

Positioning:
- Built for interns. Powered by ambition.
- Student-first, trusted network with application/approval + communities at the core.

## Stack

- Mobile: Expo + React Native + TypeScript + Expo Router + TanStack Query + Zustand + React Hook Form + Zod
- API: NestJS + TypeScript + Prisma + PostgreSQL + JWT + Socket.IO + Swagger
- Infra: Docker + docker-compose
- Monorepo packages: shared config/types/ui tokens

## Monorepo structure

- `apps/mobile` - mobile app
- `apps/api` - backend API
- `packages/ui` - shared design tokens
- `packages/config` - brand config
- `packages/types` - shared TypeScript types

## MVP features delivered

- Auth: register/login/refresh/logout/forgot/reset/me
- Student-only registration: `.edu` email validation + 24h verification token flow
- RBAC hardening: role-based decorators + guard for admin/moderator endpoints
- Refresh-token rotation with reuse detection
- Application flow: submit + status + admin review (approve/deny)
- Onboarding + editable profile
- Feed: create post, feed listing, like/comment, delete/edit own posts
- Discovery: search + suggestions
- Connections: request/accept/decline/remove + incoming/outgoing lists
- Communities: create/list/detail/join/leave/members/group posts
- Messaging: conversations + 1:1 messages + Socket.IO chat gateway (typing + new message event)
- Notifications center + read/read-all
- Push notifications (device token registration + Expo/mock provider dispatch)
- Media upload service abstraction (mock + Cloudinary-ready signed flow)
- Admin placeholders: reports, remove post, verify members, group management
- CI pipeline: GitHub Actions build/test/typecheck workflow

## Quick start

### 1) Install deps

```bash
cd internably-mvp
npm install
```

### 2) Start database

```bash
docker compose up -d postgres
```

### 3) Configure env

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

### 4) Prisma migrate + seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5) Run API

```bash
npm run dev:api
```

API docs:
- `http://localhost:4000/api/docs`

### 6) Run mobile

```bash
npm run dev:mobile
```

Then launch iOS/Android from Expo CLI.

## Demo accounts

- Admin: `admin@internably.com` / `Password123!`
- Member 1: `student1@gatech.edu` / `Password123!`
- Member 2: `student2@aamu.edu` / `Password123!`

## API endpoints implemented

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Applications
- `POST /api/applications`
- `GET /api/applications/me`
- `GET /api/admin/applications`
- `PATCH /api/admin/applications/:id`

### Users
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/:id`
- `GET /api/users/search`
- `GET /api/users/suggestions`

### Groups
- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups/:id/join`
- `POST /api/groups/:id/leave`
- `GET /api/groups/:id/members`
- `GET /api/groups/:id/posts`

### Posts
- `GET /api/posts/feed`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`
- `DELETE /api/posts/:id/like`
- `POST /api/posts/:id/comments`
- `GET /api/posts/:id/comments`

### Connections
- `POST /api/connections/request/:userId`
- `POST /api/connections/accept/:requestId`
- `POST /api/connections/decline/:requestId`
- `DELETE /api/connections/:userId`
- `GET /api/connections`
- `GET /api/connections/requests/incoming`
- `GET /api/connections/requests/outgoing`

### Messages
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`

### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `POST /api/notifications/push-token`
- `DELETE /api/notifications/push-token`

### Media
- `POST /api/media/upload-url`
- `POST /api/media/confirm`

## Notes

- Media storage is abstracted with URL fields and ready for Cloudinary/S3 service integration.
- This is a production-minded MVP foundation; advanced moderation workflows, push notifications, and richer realtime presence can be layered in Phase 2.
