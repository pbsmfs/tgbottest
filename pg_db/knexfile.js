
module.exports = {

    client: 'postgresql',
    connection: {
      host: "pg_test_db",
      database: 'postgres',
      user:     'postgres',
      password: 'angryasfuckgetoutofmymind'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

