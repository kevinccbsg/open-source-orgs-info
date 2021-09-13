const nock = require('nock');
const expect = require('expect.js');
const system = require('../../system');
const orgDetails = require('../fixtures/github/org_details.json');
const orgRepos = require('../fixtures/github/org_repos.json');

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
      .get(`/search/code?q=repos:${testOrg}/rascal+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js`)
      .reply(200, rascal);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/systemic-aws-s3+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js`)
      .reply(200, systemicAwsS3);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/mood+filename:.eslintrc+filename:.eslint.json+filename:.eslint.js`)
      .reply(200, mood);
    /** -- PR tests requests mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/rascal+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js`)
      .reply(200, rascal);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/systemic-aws-s3+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js`)
      .reply(200, systemicAwsS3);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/mood+filename:*.test.js+filename:*.specs.js+filename:*.tests.js+filename:*.spec.js`)
      .reply(200, mood);
    /** -- PR ci requests mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/rascal+filename:.travis.yml+filename:azure-pipelines.yml`)
      .reply(200, rascal);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/systemic-aws-s3+filename:.travis.yml+filename:azure-pipelines.yml`)
      .reply(200, systemicAwsS3);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/mood+filename:.travis.yml+filename:azure-pipelines.yml`)
      .reply(200, mood);
    /** -- PR ci Paths request mock -- */
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/rascal+path:.circleci+path:.github/workflows`)
      .reply(200, rascal);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/systemic-aws-s3+path:.circleci+path:.github/workflows`)
      .reply(200, systemicAwsS3);
    nock('https://api.github.com')
      .get(`/search/code?q=repos:${testOrg}/mood+path:.circleci+path:.github/workflows`)
      .reply(200, mood);
    /** -- test assertions -- */
    await controllerAPI.digest.digestOrgsRepos(testOrg);
    const { rows: repositories } = await pgAPI.query('select-repos');
    expect(repositories).to.have.length(5);
  });
});
