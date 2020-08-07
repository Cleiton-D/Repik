module.exports = {
  type: 'postgres',
  host: process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'database',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'repik',
  entities: ['./dist/models/*.js'],
  migrations: ['./dist/database/migrations/*.js'],
  cli: {
    migrationsDir: './dist/database/migrations',
  },
};
