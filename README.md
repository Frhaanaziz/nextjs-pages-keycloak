# Next.js + Keycloak Authentication Example

This project demonstrates how to integrate [Next.js](https://nextjs.org/) with [Keycloak](https://www.keycloak.org/) authentication using [NextAuth.js](https://next-auth.js.org/). It provides a secure authentication flow with support for access token refresh and logout.

## Features

- Next.js pages directory structure
- Keycloak authentication via NextAuth.js
- Secure token storage (encrypted in session)
- Automatic token refresh
- Logout support (calls Keycloak logout endpoint)
- TypeScript support

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- [Keycloak](https://www.keycloak.org/) instance
- Keycloak client configured for your app

### Environment Variables

Create a `.env.local` file in the root directory and set the following variables:

```env
NEXTAUTH_SECRET=your_nextauth_secret
KEYCLOAK_CLIENT_ID=your_keycloak_client_id
KEYCLOAK_CLIENT_SECRET=your_keycloak_client_secret
KEYCLOAK_ISSUER=https://your-keycloak-domain/realms/your-realm
```

### Install Dependencies

```bash
pnpm install
```

or

```bash
npm install
```

### Development

```bash
pnpm dev
```

or

```bash
npm run dev
```

### Build and Start

```bash
pnpm build
pnpm start
```

or

```bash
npm run build
npm start
```

## Usage

- Visit the home page.
- Click **Signin** to authenticate with Keycloak.
- After login, your session and tokens will be displayed.
- Click **Signout** to log out (calls Keycloak logout endpoint).

## Project Structure

- `src/pages/` - Next.js pages (including `/api/auth/[...nextauth].ts`)
- `src/server/auth/` - Authentication logic and configuration
- `src/env.ts` - Environment variable validation

## Customization

- Update Keycloak client and realm settings as needed.
- Extend user/session types in `src/server/auth/config.ts` for custom claims.

## License

MIT
