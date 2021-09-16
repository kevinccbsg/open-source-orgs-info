const nock = require('nock');
const expect = require('expect.js');
const system = require('../../system');
const orgDetails = require('../fixtures/github/org_details.json');
const orgRepos = require('../fixtures/github/org_repos.json');
const {
  rascalLinter,
  systemicAwsS3Linter,
  moodLinter,
} = require('../fixtures/github/linterMocks');
const {
  rascalTest,
  systemicAwsS3Test,
  moodTest,
} = require('../fixtures/github/testsMocks');
const {
  files: {
    rascalCi,
    systemicAwsS3Ci,
    moodCi,
  },
  paths: {
    rascalPaths,
    systemicAwsS3Paths,
    moodPaths,
  },
} = require('../fixtures/github/ciMocks');

describe('Digest method Tests', () => {
  let controllerAPI;
  let pgAPI;
  const sys = system();

  before(async () => {
    const { controller, pg } = await sys.start();
    controllerAPI = controller;
    pgAPI = pg;
  });

  beforeEach(async () => {
    await pgAPI.query('truncate-all');
  });

  after(() => sys.stop());

  it('should save the right amount of users', async () => {
    const testOrg = 'test-org';
    nock('https://api.github.com')
      .get(`/orgs/${testOrg}`)
      .reply(200, orgDetails);
    nock('https://api.github.com')
      .get(`/orgs/${testOrg}/repos?type=public&sort=updated&per_page=100&page=1`)
      .reply(200, orgRepos);
    /** -- PR linter requests mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('rascal+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js')}`)
      .reply(200, rascalLinter);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('systemic-aws-s3+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js')}`)
      .reply(200, systemicAwsS3Linter);
    // TODO: mood is a forked repository and this search does not work
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('mood+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js')}`)
      .reply(200, moodLinter);
    /** -- PR tests requests mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('rascal+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js')}`)
      .reply(200, rascalTest);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('systemic-aws-s3+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js')}`)
      .reply(200, systemicAwsS3Test);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('mood+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js')}`)
      .reply(200, moodTest);
    /** -- PR ci requests mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('rascal+filename:.travis.yml+filename:azure-pipelines.yml')}`)
      .reply(200, rascalCi);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('systemic-aws-s3+filename:.travis.yml+filename:azure-pipelines.yml')}`)
      .reply(200, systemicAwsS3Ci);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('mood+filename:.travis.yml+filename:azure-pipelines.yml')}`)
      .reply(200, moodCi);
    /** -- PR ci Paths request mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('rascal+path:.circleci+path:.github/workflows')}`)
      .reply(200, rascalPaths);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('systemic-aws-s3+path:.circleci+path:.github/workflows')}`)
      .reply(200, systemicAwsS3Paths);
    nock('https://api.github.com')
      .get(`/search/code?q=repo:${testOrg}/${encodeURIComponent('mood+path:.circleci+path:.github/workflows')}`)
      .reply(200, moodPaths);
    /** -- test assertions -- */
    await controllerAPI.digest.digestOrgsRepos(testOrg);
    const { rows: repositories } = await pgAPI.query('select-repos');
    const linterRepos = repositories.filter(repo => repo.has_linter && repo.linter_file);
    expect(linterRepos).to.have.length(2);
    const testRepos = repositories.filter(repo => repo.has_tests);
    expect(testRepos).to.have.length(2);
    const ciRepos = repositories.filter(repo => repo.ci);
    expect(ciRepos).to.have.length(2);
    expect(repositories).to.have.length(3);
  });
});
