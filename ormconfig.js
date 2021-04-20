/* eslint-disable-next-line */
require('dotenv').config();

module.exports = {
  type: 'mysql',
  port: 3306,
  host: process.env.DB_HOSTNAME || 'localhost',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
