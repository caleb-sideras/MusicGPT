import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
    schema: "./db/schema.ts",
    out: "./db/drizzle",
    dbCredentials: {
        connectionString: 'mysql://fabh9hcku0auqjklj56q:pscale_pw_8MtGPwxRwsDylNtLJOhtncdgFBEQYll2jNrnOlh2BK8@aws.connect.psdb.cloud/musicgpt?ssl={"rejectUnauthorized":true}',
    },
    driver: "mysql2"
} satisfies Config;
