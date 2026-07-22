import pg from 'pg'
pg.types.setTypeParser(1700, parseFloat)

const testPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

export default testPool