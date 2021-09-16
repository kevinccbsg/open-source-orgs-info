const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');

describe.skip('Orgs API endpoint', () => {
  const testOrg = 'test-org';
  let pgAPI;
  let request;
  const sys = system();

  before(async () => {
    const { pg, app } = await sys.start();
    request = supertest(app);
    pgAPI = pg;
  });

  beforeEach(async () => {
    await pgAPI.query('truncate-all');
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

  it('retrieve info from endpoint "/api/v1/orgs/:orgName/repos" with test filter', async () => (
    request.get(`/api/v1/orgs/${testOrg}/repos?linter=true`)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.length(0);
      })
  ));

  it('retrieve info from endpoint "/api/v1/orgs/:orgName/repos" with test filter', async () => (
    request.get(`/api/v1/orgs/${testOrg}/repos?maxFiles=200`)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.length(1);
      })
  ));
});
