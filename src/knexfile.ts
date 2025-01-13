import { Knex } from 'knex';



 const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      port: 5432
    },
  };
  
  export default knexConfig;