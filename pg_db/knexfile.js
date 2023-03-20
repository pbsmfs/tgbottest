// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    client: 'postgresql',
    connection: {
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

