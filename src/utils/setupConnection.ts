import { MatchesEntity } from 'modules/matches/entities';
import { SwipesEntity } from 'modules/swipes/entities';
import { UserEntity } from 'modules/user/entitites';
import { UserPreferencesEntity } from 'modules/user_preferences/entities';
import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export const setupConnection = async () => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`,
  });

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`,
  });

  db.public.registerFunction({
    name: 'obj_description',
    args: [DataType.text, DataType.text],
    returns: DataType.text,
    implementation: () => 'test',
  });

  db.public.registerFunction({
    name: 'uuid_generate_v4',
    args: [],
    returns: DataType.text,
    implementation: () => 'test',
  });

  db.public.registerFunction({
    name: 'age',
    args: [DataType.date, DataType.date],
    returns: DataType.integer,
    implementation: ([date1, date2]) => Math.abs(date1 - date2),
  });

  const query = `
  SELECT columns.*
  `;
  const queries = [];

  db.public.interceptQueries((queryText) => {
    if (
      queryText.replace(/[\n ]/g, '').startsWith(query.replace(/[\n ]/g, ''))
    ) {
      return [];
    }

    if (queryText.includes('ALTER TABLE') && queryText.includes('ADD "')) {
      const query = queryText.replace('ADD', 'ADD COLUMN IF NOT EXISTS');
      return db.public.query(query).rows;
    }

    if (
      queryText.includes('ALTER TABLE') &&
      queryText.includes('ADD') &&
      queryText.includes('CONSTRAINT')
    ) {
      return [];
    }

    if (
      queryText.includes('CREATE TYPE') ||
      queryText.includes('CREATE UNIQUE INDEX') ||
      queryText.includes('CREATE INDEX')
    ) {
      const check = queries.find((q) => q === queryText);
      if (!check) {
        queries.push(queryText);
        return null;
      } else {
        return [];
      }
    }

    return null;
  });

  const connection: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [UserEntity, UserPreferencesEntity, SwipesEntity, MatchesEntity],
    synchronize: true,
    autoLoadEntities: true,
  });

  await connection.initialize();
  return connection;
};
