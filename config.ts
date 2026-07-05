export default {
  auth: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET
    },
    secret: process.env.AUTH_SECRET
  },
  baseURL: 'http://localhost:3000',
  database: {
    dataDir: process.env.DATABASE_DATA_DIR,
    driver: process.env.DATABASE_DRIVER,
    url: process.env.DATABASE_URL
  }
}
