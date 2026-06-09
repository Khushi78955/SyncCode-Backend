const {z} = require("zod");
const envSchema = z.object({
    DATABASE_URL:z.string().min(1),

    JWT_ACCESS_SECRET : z.string().min(1),
    JWT_REFRESH_SECRET : z.string().min(1),

    ACCESS_TOKEN_EXPIRES_IN:z.string().min(1),
    REFRESH_TOKEN_EXPIRES_IN:z.string().min(1),

    EMAIL_USER:z.string().email(),
    EMAIL_PASSWORD:z.string().min(1),


    GOOGLE_CLIENT_ID : z.string().min(1),

    GITHUB_CLIENT_ID:z.string().min(1),
    GITHUB_CLIENT_SECRET:z.string().min(1),


    DISCORD_CLIENT_ID:z.string().min(1),
    DISCORD_CLIENT_SECRET:z.string().min(1)
})

const env = envSchema.safeParse(process.env)

module.exports = env;