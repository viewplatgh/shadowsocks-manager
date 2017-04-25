'use strict';

const knex = appRequire('init/knex').knex;
const tableName = 'account';

const config = appRequire('services/config').all();
const createTable = async() => {
};

exports.createTable = createTable;
