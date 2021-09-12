const auth = {
  username: process.env.GITHUB_USER || '',
  password: process.env.GITHUB_TOKEN || '',
};

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
  routes: {
    admin: {
      openAPIOptions: {
        info: {
          version: '1.0.0',
          title: 'Open source API Info',
          license: {
            name: 'MIT',
          },
        },
        security: {
          BasicAuth: {
            type: 'http',
            scheme: 'basic',
          },
        },
        baseDir: process.cwd(),
        // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
        filesPattern: './**/*-routes.js',
      },
    },
  },
  /* --- Database settings --- */
  pg: {
    connection: {
      user: process.env.POSTGRES_USER || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      max: 10,
      migrations: [{
        directory: 'sql/migrations',
        filter: '\\.sql$',
      }],
      idleTimeoutMillis: 30000,
      sql: 'sql/queries',
      ssl: true,
    },
    schema: 'content',
  },
  logger: {
    transport: 'console',
    include: [
      'tracer',
      'timestamp',
      'level',
      'message',
      'error.message',
      'error.code',
      'error.stack',
      'request.url',
      'request.headers',
      'request.params',
      'request.method',
      'response.statusCode',
      'response.headers',
      'response.time',
      'process',
      'system',
      'package.name',
      'service',
    ],
    exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
  },
  /** --- controller config --- */
  controller: {
    digest: {
      // TODO: improve these files
      CIFiles: ['.travis.yml', 'circleci', '.github'],
      linterFiles: ['.eslinrc', '.eslint.json', '.eslint.js'],
      testFiles: ['test', 'specs', 'tests'],
      // number of results on each github request
      requestedRepos: 100,
    },
  },
  /** --- Github API endpoints --- */
  github: {
    api: {
      getRepos: {
        url: 'https://api.github.com/orgs/:org/repos',
        method: 'get',
        auth,
      },
      getRepoContent: {
        url: 'https://api.github.com/repos/:org/:repo/contents',
        method: 'get',
        auth,
      },
      orgDetails: {
        url: 'https://api.github.com/orgs/:org',
        method: 'get',
        auth,
      },
    },
  },
};
