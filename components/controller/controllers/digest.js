const { sleep } = require('../../../utils');
/* eslint-disable no-await-in-loop */
module.exports = () => {
  const start = async ({
    logger, github, store, config,
  }) => {
    const filterInfo = async (org, repoName, query) => {
      const q = `repo:${org}/${repoName} ${query}`;
      const { data: repositoryFiles } = await github.searchCode({
        query: {
          q,
        },
      });
      return repositoryFiles;
    };

    const queryBuilder = type => files => (
      files.map(file => (
        `${type}:${file}`
      )).join(' ')
    );

    const filesQuery = queryBuilder('filename');
    const pathQuery = queryBuilder('path');

    const getCIInfo = async (org, repoName) => {
      const testsResults = await filterInfo(org, repoName, filesQuery(config.CIFiles));
      if (testsResults && testsResults.items.length !== 0) {
        const testFile = testsResults.items[0].name;
        return testFile;
      }
      const githubAction = await filterInfo(org, repoName, pathQuery(config.CIPaths));
      return githubAction && githubAction.items.length !== 0 ? 'githubActions' : null;
    };

    const addExtraParameters = async (org, repo) => {
      logger.info(`Digesting org ${org} repository ${repo.name}`);
      const ci = await getCIInfo(org, repo.name);
      const linterResults = await filterInfo(org, repo.name, filesQuery(config.linterFiles));
      const hasLinter = linterResults && linterResults.items.length !== 0;
      const linterFile = hasLinter ? linterResults.items[0].name : null;
      const testsResults = await filterInfo(org, repo.name, filesQuery(config.testFiles));
      const hasTests = testsResults && testsResults.items.length !== 0;
      const completedRepo = {
        ...repo,
        ci,
        org,
        linter_file: linterFile,
        has_linter: hasLinter,
        has_tests: hasTests,
      };
      logger.info(`Saving org ${org} repository ${repo.name}...`);
      return store.saveRepository(completedRepo);
    };

    const digestOrgsRepos = async org => {
      logger.info(`Digesting organization repositories ${org}`);
      const { data: orgDetail } = await github.orgDetails({
        params: {
          org,
        },
      });
      const publicRepos = orgDetail.public_repos;
      const pages = Math.ceil(publicRepos / config.requestedRepos);
      for (let index = 0; index < pages; index += 1) {
        const { data: repositories } = await github.getRepos({
          params: {
            org,
          },
          query: {
            type: 'public',
            sort: 'updated',
            per_page: config.requestedRepos,
            page: (index + 1),
          },
        });
        for (let repositoryIndex = 0; repositoryIndex < repositories.length; repositoryIndex += 1) {
          const repo = repositories[repositoryIndex];
          if (repositoryIndex % 5 === 0) {
            logger.info('waiting to free github api limit...');
            await sleep(config.waitLimitTime);
          }
          await addExtraParameters(org, repo);
        }
      }
    };
    return { digestOrgsRepos };
  };
  return { start };
};
