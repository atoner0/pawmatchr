import pg from 'pg'

const testPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

export default testPool