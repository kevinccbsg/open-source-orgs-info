const nock = require('nock');
const expect = require('expect.js');
const system = require('../../system');
const orgRepos = require('../fixtures/github/org_repos.json');
const reactFormBuilder = require('../fixtures/github/react-form-builder.json');
const rascal = require('../fixtures/github/rascal.json');
const systemicAwsS3 = require('../fixtures/github/systemic-aws-s3.json');
const cybersecurityHandbook = require('../fixtures/github/cybersecurity-handbook.json');
const mood = require('../fixtures/github/mood.json');


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

  it.only('should save the right amount of users', async () => {
    const testOrg = 'test-org';
    nock('https://api.github.com')
      .get(`/orgs/${testOrg}/repos?type=public&sort=updated`)
      .reply(200, orgRepos);
    /** -- PR details mock -- */
    nock('https://api.github.com')
      .get(`/repos/${testOrg}/react-form-builder/contents`)
      .reply(200, reactFormBuilder);
    nock('https://api.github.com')
      .get(`/repos/${testOrg}/rascal/contents`)
      .reply(200, rascal);
    nock('https://api.github.com')
      .get(`/repos/${testOrg}/systemic-aws-s3/contents`)
      .reply(200, systemicAwsS3);
    nock('https://api.github.com')
      .get(`/repos/${testOrg}/cybersecurity-handbook/contents`)
      .reply(200, cybersecurityHandbook);
    nock('https://api.github.com')
      .get(`/repos/${testOrg}/mood/contents`)
      .reply(200, mood);
    /** -- PR reviews details mock -- */
    await controllerAPI.digest.digestOrgsRepos(testOrg);
    const { rows: repositories } = await pgAPI.query('select-repos');
    expect(repositories).to.have.length(5);
  });
});
