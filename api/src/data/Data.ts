import { Pool } from "pg";
const CONN = process.env.DATABASE_URL;

export const dBase: Pool = new Pool({
    connectionString: CONN
});



