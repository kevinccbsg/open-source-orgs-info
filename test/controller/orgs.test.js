const nock = require('nock');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const orgRepos = require('../fixtures/github/org_repos.json');
const reactFormBuilder = require('../fixtures/github/react-form-builder.json');
const rascal = require('../fixtures/github/rascal.json');
const systemicAwsS3 = require('../fixtures/github/systemic-aws-s3.json');
const cybersecurityHandbook = require('../fixtures/github/cybersecurity-handbook.json');
const mood = require('../fixtures/github/mood.json');

describe('Orgs API endpoint', () => {
  const testOrg = 'test-org';
  let controllerAPI;
  let pgAPI;
  let request;
  const sys = system();

  before(async () => {
    const { controller, pg, app } = await sys.start();
    request = supertest(app);
    controllerAPI = controller;
    pgAPI = pg;
  });

  beforeEach(async () => {
    await pgAPI.query('truncate-all');
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
  });

  after(() => sys.stop());

  it('retrieve info from endpoint "/api/v1/orgs/:orgName/repos"', async () => request.get(`/api/v1/orgs/${testOrg}/repos`)
    .expect(200)
    .then(({ body }) => {
      expect(body).to.have.length(5);
    }));

  it('retrieve info from endpoint "/api/v1/orgs/:orgName/repos" with test filter', async () => (
    request.get(`/api/v1/orgs/${testOrg}/repos?tests=true`)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.length(3);
      })
  ));
});
