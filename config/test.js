module.exports = {
  logger: { transport: null },
  pg: {
    connection: {
      host: process.env.POSTGRES_HOST || 'localhost',
      ssl: false,
      sql: ['sql/queries', 'test/sql/scripts'],
    },
  },
  controller: {
    digest: {
      // wait time to free github API
      waitLimitTime: 500,
    },
  },
};
