const repository = require('./mapper/repository')

module.exports = () => {
  const start = async ({ pg }) => {
    const saveRepository = async repo => (
      pg
        .upsert(`${pg.schema}.repository`, repository(repo))
    );

    return { saveRepository };
  };

  return { start };
};
