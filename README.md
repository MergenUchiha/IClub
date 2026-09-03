# IClub API

Backend for a student club: members book the club room for a lesson slot,
order from the café menu, and administrators manage the catalogue, the
members and the orders.

Built with NestJS 11 on Fastify, PostgreSQL through Prisma, and Zod for both
request validation and response serialisation.

## Stack

| Area | Choice |
|---|---|
| Runtime | Node.js 20+, TypeScript 5 |
| Framework | NestJS 11 with the Fastify adapter |
| Database | PostgreSQL 16, Prisma ORM (multi-file schema) |
| Validation | Zod via `nestjs-zod` — one schema per contract, reused for Swagger |
| Auth | JWT access/refresh pairs, separate secrets for members and admins |
| Passwords | argon2 |
| Rate limiting | `@nestjs/throttler`, backed by Redis in production |
| Logging | Winston |
| Errors | Sentry (optional, enabled by setting a DSN) |
| Docs | Swagger at `/docs`, behind a flag |

## Layout

```
src/
├── components/        feature modules (auth, user, booking, order, product, …)
│   └── <feature>/
│       ├── *.controller.ts
│       ├── *.service.ts
│       └── decorator/     one file per endpoint: role + Swagger metadata
├── common/            guards, interceptors, pipes, param decorators
├── config/            environment schema and validation
├── libs/
│   ├── contracts/     Zod schemas, DTOs and the shared exception catalogue
│   └── media/         file storage for product images
├── prisma/            schema folder, migrations, health indicator
├── utils/             logger, health check, exception filter
└── helpers/           seeds, hashing, constants
```

Each endpoint carries its role in a decorator next to its Swagger
description, for example `USER()` or `ADMIN()`; `PUBLIC()` opts a route out of
authentication. The global `AuthGuard` reads those and validates the bearer
token against the matching secret.

## Getting started

Requirements: Node.js 20 or newer, PostgreSQL 16, and — only for a production
run — Redis. Dependencies are installed with [bun](https://bun.sh); the
scripts themselves run under npm.

`package.json` pins a single `fastify` version through `overrides`.
`@nestjs/platform-fastify` depends on an exact version of its own, and
without the override the tree ends up with two copies: the plugin type
augmentations then stop merging and the build fails on every
`app.register(...)` call.

```bash
git clone https://github.com/MergenUchiha/IClub.git
cd IClub
bun install                   # dependencies only; every script below is npm

cp .env.example .env          # then fill in the values
npm run prisma:generate
npm run prisma:migrate        # applies migrations to the database
npm run seed                  # loads the department reference list

npm run start:dev             # http://localhost:5005/api
```

A database is enough to boot: Redis is only required when
`NODE_ENV=production`, where it stores the rate-limiting counters.

Postgres in a container, if you would rather not install it locally:

```bash
docker run -d --name iclub-postgres \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=iclub \
  -p 127.0.0.1:5432:5432 postgres:16-alpine
```

### Production

```bash
npm run build
npm run prisma:deploy
NODE_ENV=production npm run start:prod
```

## Configuration

Every variable the application reads is listed in
[`.env.example`](.env.example) with a comment. The configuration is validated
by a Zod schema at startup, so a missing or malformed value stops the process
with a message naming the variable instead of failing somewhere deeper.

The ones worth calling out:

| Variable | Notes |
|---|---|
| `IS_SWAGGER_ENABLED` | Serves `/docs`. Keep it `false` in production — it publishes every route and payload shape. |
| `CORS_ORIGINS` | Comma-separated allow-list. Required in production; in development an empty value permits any `localhost` port. |
| `JWT_*_TIME` | Lifetimes in the zeit/ms format (`15m`, `1h`, `30d`). |
| `DEFAULT_ADMIN_*` | The first admin, created on first boot if the username is not taken. Change the password afterwards. |
| `HEALTH_CHECK_TOKEN` | `GET /api/health` expects it as a bearer token. |
| `REDIS_*` | Required only when `NODE_ENV=production`. |
| `SENTRY_DSN` | Leave empty to disable error reporting. |

`redis.conf.example` is the matching Redis configuration; copy it to
`redis.conf`, set the password, and keep that copy out of version control.

## Authentication

Two separate realms with their own secrets: members sign in with a phone
number, administrators with a username. Both receive an access token and a
refresh token.

- The access token goes in `Authorization: Bearer <token>`.
- The refresh token is also set as an httpOnly cookie, which is what
  `GET /auth/*/refresh` reads.
- Refresh tokens are stored as SHA-256 digests, one row per subject, and are
  replaced on every refresh. A logout deletes the row.
- Banning a member deletes their refresh token, so the session cannot be
  renewed. The ban itself is carried in the access token, so an access token
  issued before the ban stays valid until it expires — at most
  `JWT_ACCESS_TIME`.

## Endpoints

All paths are prefixed with `/api`.

### Auth

| Method | Path | Access |
|---|---|---|
| POST | `/auth/user/login` | public |
| GET | `/auth/user/refresh` | refresh cookie |
| POST | `/auth/user/logout` | member |
| GET | `/auth/user/me` | member |
| POST | `/auth/admin/login` | public |
| GET | `/auth/admin/refresh` | refresh cookie |
| POST | `/auth/admin/logout` | admin |

### Members

| Method | Path | Access |
|---|---|---|
| POST | `/user` | admin |
| GET | `/user` | admin |
| GET | `/user/:userId` | admin |
| PATCH | `/user/:userId` | admin |
| PATCH | `/user/:userId/ban` | admin |
| DELETE | `/user/:userId` | admin |
| GET | `/department` | admin |

### Catalogue

| Method | Path | Access |
|---|---|---|
| GET | `/category`, `/category/:categoryId` | public |
| POST · PATCH · DELETE | `/category`, `/category/:categoryId` | admin |
| GET | `/product`, `/product/:productId` | public |
| POST · PATCH · DELETE | `/product`, `/product/:productId` | admin |
| POST | `/product/:productId/image` | admin |
| DELETE | `/product/:productId/image` | admin |

Product images are stored on disk under `uploads/` and served from
`/uploads/<file>`. Uploads are limited to 5 MB and to JPEG, PNG and GIF,
checked by both extension and content type; a rejected upload leaves nothing
on disk. Deleting a product, or the category it belongs to, removes its
image file along with the row.

### Orders

| Method | Path | Access |
|---|---|---|
| POST | `/orders` | member |
| GET | `/orders/my` | member |
| GET | `/orders/my/:orderId` | member |
| PATCH | `/orders/:id/cancel` | member, own order only |
| GET | `/orders`, `/orders/:id` | admin |
| PATCH | `/orders/:id` | admin |
| PATCH | `/orders/admin/:id/cancel` | admin |
| PATCH | `/orders/admin/:id/complete` | admin |

An order moves through `PENDING → VERIFIED → COMPLETED`, or to `CANCELLED`.
A member may cancel their own order while it is `PENDING`; once an admin has
marked it `VERIFIED` or `COMPLETED` only an admin can act on it. Completing
an order that is still `PENDING` is refused. Item prices are taken from the
catalogue, not from the request body, so the total cannot be influenced by
the client.

### Bookings

| Method | Path | Access |
|---|---|---|
| POST | `/bookings/date` | member — the booking for a given date |
| POST | `/bookings` | member — open a date and take a slot |
| POST | `/bookings/:bookingId/details` | member — take a slot on an open date |
| PATCH | `/bookings/:bookingId/details/:detailId` | member, own slot only |
| DELETE | `/bookings/:bookingId/details/:detailId` | member, own slot only |
| GET | `/bookings` | member |
| GET | `/bookings/details/my` | member |
| GET | `/bookings/admin`, `/bookings/admin/:bookingId` | admin |
| DELETE | `/bookings/admin/:bookingId/details/:detailId` | admin |

A date holds up to three lesson slots (`LESSON1`–`LESSON3`), each of which can
be booked with or without the TV. Listing bookings shows who took which slot
by name only — phone numbers and student ids stay private.

### Health

`GET /api/health` reports whether the instance can reach its database. It
expects `Authorization: Bearer $HEALTH_CHECK_TOKEN` and is excluded from
Swagger.

## Data model

```
Admin ─┬─ Token                     Booking ─── Detail ─── User
User  ─┴─ Token                                   │
                                                lesson, tv, group
Category ─── Product ─── Image
                 │
Order ─── OrderItem
  └─ User
```

- `User` — members and teachers; teachers have no `studentId`.
- `Token` — one refresh-token digest per member or admin.
- `Booking` — one row per date; `Detail` — one row per taken lesson slot.
- `Order` / `OrderItem` — café orders with a status and a computed total.
- `Category` / `Product` / `Image` — the menu; a product has at most one image.
- `Department` — reference list loaded by the seed script.

## Scripts

| Script | What it does |
|---|---|
| `npm run start:dev` | Watch mode |
| `npm run start:prod` | Runs the compiled `dist/main.js` |
| `npm run build` | Compiles to `dist/` |
| `npm run lint` | ESLint with type-aware rules, autofixing |
| `npm run format` | Prettier |
| `npm run prisma:migrate` | Creates and applies a migration |
| `npm run prisma:deploy` | Applies existing migrations (production) |
| `npm run prisma:studio` | Opens Prisma Studio |
| `npm run seed` | Loads the department reference list |
| `npm test` | Jest |

## Known limitations

- There are no automated tests. Every endpoint was exercised by hand against
  a live database, in both development and production mode.
- `GET /bookings` returns every booking ever made, without pagination.
- `User.department` is free text even though a `Department` table exists;
  there is no foreign key between them.
- `fastify-file-interceptor` pulls in `multer@1.4.5-lts.1`, which has open
  advisories. Replacing it with `@fastify/multipart` directly would remove
  that transitive dependency.
- `@nestjs/swagger` is capped below 11.4.3. That release restricted the
  package `exports` field, and `nestjs-zod@4` reaches into
  `@nestjs/swagger/dist/services/schema-object-factory`, so the application
  fails to boot with a newer one. Lifting the cap means upgrading to
  `nestjs-zod@5`, which changes the DTO API.
- `uuid` is listed as a dependency although nothing in `src` imports it:
  `fastify-file-interceptor` requires it at runtime without declaring it,
  and the application does not start without it. Do not remove it.
- The refresh token is returned in the login response body as well as in the
  cookie. Dropping it from the body is the stricter option and is waiting on
  the client to stop reading it there.
