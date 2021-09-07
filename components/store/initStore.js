const isEmpty = require('lodash/isEmpty');
const repository = require('./mapper/repository');

module.exports = () => {
  const start = async ({ pg }) => {
    const queryBuilder = (filters, filterQuery, tableAlias) => {
      let returnQuery = filterQuery;
      if (!filters || isEmpty(filters)) return returnQuery;
      if (filters.tests === 'true') {
        returnQuery = `${filterQuery} and ${tableAlias}.has_tests = true`;
      }
      if (filters.linter === 'true') {
        returnQuery = `${filterQuery} and ${tableAlias}.has_linter = true`;
      }
      if (filters.maxFiles) {
        returnQuery = `${filterQuery}
          and ${tableAlias}.size BETWEEN
          ${filters.minFiles || 0} AND ${filters.maxFiles}`;
      }
      return returnQuery;
    };

    const saveRepository = async repo => (
      pg
        .upsert(`${pg.schema}.repository`, repository(repo))
    );

    const getRepositories = async (org, filters) => {
      const whereClauses = queryBuilder(filters, `
        r.org = '${org}'
      `, 'r');
      const { rows } = await pg.query(`
        SELECT
          r.name,
          r.url,
          r.description,
          r.updated_at,
          r.size,
          r.has_issues,
          r.ci,
          r.has_linter,
          r.has_tests
        FROM
          ${pg.schema}.repository r
        WHERE
          ${whereClauses}
      `);
      return rows;
    };

    return { saveRepository, getRepositories };
  };

  return { start };
};
