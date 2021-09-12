module.exports = {
  pg: {
    connection: {
      connectionString: process.env.POSTGRES_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    },
    schema: 'content',
  },
};
