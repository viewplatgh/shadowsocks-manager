const knex = appRequire('init/knex').knex;
const tableName = 'server';
const config = appRequire('services/config').all();
const manager = appRequire('services/manager');
const log4js = require('log4js');
const logger = log4js.getLogger('flowSaver');

const createTable = async () => {
  if(config.empty) {
    await knex.schema.dropTableIfExists(tableName);
  }
  await knex.schema.createTableIfNotExists(tableName, function(table) {
    table.increments('id');
    table.string('name');
    table.string('host');
    table.integer('port');
    table.string('password');
    table.string('method').defaultTo('aes-256-cfb');
  });
  const list = await knex('server').select(['name', 'host', 'port', 'password']);
  if(list.length === 0) {
    const host = config.manager.address.split(':')[0];
    const port = +config.manager.address.split(':')[1];
    const password = config.manager.password;
    await manager.send({
      command: 'flow',
      options: {
        clear: false,
      },
    }, {
      host,
      port,
      password,
    }).catch((e) => {
      const errmsg = `Failed to connect to server ${host}:${port}, is type m manager.address matching type s manager.address?`;
      logger.error(errmsg);
      throw e;
    });
    logger.info(`Connected to server ${host}:${port} successfully`);
    await knex('server').insert({
      name: 'default',
      host,
      port,
      password,
    });
  } else {
    logger.info(`Existing server found: ${list[0].host}:${list[0].port}`);
  }
  return;
};

exports.createTable = createTable;
