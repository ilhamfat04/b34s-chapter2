// import pg package
const { Pool } = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'b34s_chapter2',
    port: 5432,
    user: 'postgres',
    password: 'root'
})

// export dbPool
module.exports = dbPool
