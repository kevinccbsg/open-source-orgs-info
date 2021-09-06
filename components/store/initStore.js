const repository = require('./mapper/repository');

module.exports = () => {
  const start = async ({ pg }) => {
    const saveRepository = async repo => (
      pg
        .upsert(`${pg.schema}.repository`, repository(repo))
    );

    const getRepositories = async org => {
      const { rows } = await pg.query(`
        SELECT
          r.name,
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
          r.org = '${org}'
      `);
      return rows;
    };

    return { saveRepository, getRepositories };
  };

  return { start };
};
