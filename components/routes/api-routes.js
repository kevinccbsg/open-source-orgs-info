const {
  handleHttpError,
  tagError,
} = require('error-handler-module');
const { validateRequest, validateResponse } = require('express-oas-validator');

module.exports = () => {
  const start = async ({ app, logger, controller }) => {
    /**
     * POST /api/v1/repository/digest
     * @description Digest repository and org in our DB
     * @summary summary
     * @param {DigestRequest} request.body.required - repository and org
     * @return {object} 200 - process repository success
     */
    app.post('/api/v1/repository/digest', validateRequest(), async (req, res, next) => {
      try {
        const { org, repo } = req.body;
        await controller.digest.digestRepo(org, repo);
        return res.json({ success: true });
      } catch (err) {
        return next(tagError(err));
      }
    });

    /**
     * GET /api/v1/orgs/{orgName}/repos
     * @summary Request orgs repositories
     * @param {string} orgName.path - Organization name
     * @param {string} tests.query - Filter repositories with tests
     * @param {string} linter.query - Filter repositories with linter config
     * @param {integer} maxFiles.query - Filter max repository files
     * @param {integer} minFiles.query - Filter min repository files
     * @return {array<RepositoriesResponse>} 200 - repository list
     */
    app.get('/api/v1/orgs/:orgName/repos', validateRequest(), async (req, res, next) => {
      try {
        const { orgName } = req.params;
        const filters = req.query;
        const repos = await controller.orgs.fetch(orgName, filters);
        validateResponse(repos, req);
        return res.json(repos);
      } catch (err) {
        return next(tagError(err));
      }
    });

    app.use(handleHttpError(logger));

    return Promise.resolve();
  };

  return { start };
};
