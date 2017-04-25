const knex = appRequire('init/knex').knex;
const tableName = 'account';

const config = appRequire('services/config').all();
const createTable = async() => {
  if(config.empty) {
    await knex.schema.dropTableIfExists(tableName);
  }
  const exist = await knex.schema.hasTable(tableName);
  if(exist) {
    return;
  }

  return knex.schema.createTableIfNotExists(tableName, function(table) {
    table.increments('id').primary();
    table.integer('type');  // 2: 7 days, 3: 30 days, 4: 1 day, 5: 1 hour, other: no limits
    table.integer('userId');
    table.string('server');
    table.integer('port');
    table.string('password');
    table.string('data');
    table.dateTime('createdTime');
    table.integer('flow');
    table.integer('limit');
    table.integer('status');
    table.integer('autoRemove').defaultTo(0);
  });
};

exports.createTable = createTable;
