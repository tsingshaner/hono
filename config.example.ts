// Copy this file to `config.ts` (gitignored) and fill in real values.
// `config.ts` is loaded via c12 (see src/infrastructure/config.ts).
export default {
  auth: {
    // GitHub Settings -> Developer settings -> OAuth Apps -> New OAuth App
    // Homepage URL: {baseURL}
    // Authorization callback URL: {baseURL}/api/auth/callback/github
    github: {
      clientId: 'your-github-oauth-app-client-id',
      clientSecret: 'your-github-oauth-app-client-secret'
    },
    // Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
    secret: 'replace-with-a-random-secret'
  },
  baseURL: 'http://localhost:3000',
  // Use `{ driver: 'pglite' }` for an in-memory database in development/tests.
  // Use `{ driver: 'pglite', dataDir: '.data/pglite' }` to persist it locally.
  database: 'postgresql://user:password@host:5432/db?sslmode=require'
} as const
