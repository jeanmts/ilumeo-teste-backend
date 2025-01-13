import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema
    .createTable('collaborators', (table) => {
      table.increments('id').primary();
      table.string('contributor_code').notNullable().unique();
    })
    .createTable('point_records', (table) => {
      table.increments('id').primary();
      table.integer('contributor_id').notNullable();
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time');
      table.timestamp('duration');
      table.foreign('contributor_id').references('collaborators.id');
    });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema
    .dropTableIfExists('point_records')
    .dropTableIfExists('collaborators');
};
