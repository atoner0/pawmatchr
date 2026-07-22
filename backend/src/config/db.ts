import pg from 'pg'
pg.types.setTypeParser(1700, parseFloat)
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export const query = (text: string, params?: unknown[]) => {
    return pool.query(text, params)
}

export default pool