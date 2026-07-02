import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const testPool = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
})

export default testPool