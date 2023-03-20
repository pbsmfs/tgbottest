exports.up = knex => {
    return knex.schema.createTable('users', t => {
      t.timestamp('time').primary()
      t.string('id')
      t.string('username', 32)
      t.string('message', 2000)
    })
  }
  
  exports.down = knex => {
    return knex.schema.dropTable('users')
  }