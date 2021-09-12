/* eslint-disable no-await-in-loop */
module.exports = () => {
  const start = async ({
    logger, github, store, config,
  }) => {
    const repoDetails = async (org, repoName) => {
      const { data: repositoryFiles } = await github.getRepoContent({
        params: {
          org,
          repo: repoName,
        },
      });
      return repositoryFiles;
    };

    const getExtraInfo = (files, exceptions) => (
      files.some(file => (
        exceptions.includes(file.path)
      ))
    );

    const getExtraInfoFile = (files, exceptions) => {
      const infoFile = files.find(file => (
        exceptions.includes(file.path)
      ));
      return infoFile ? infoFile.path : null;
    };

    const addExtraParameters = async (org, repo) => {
      logger.info(`Digesting org ${org} repository ${repo.name}`);
      const files = await repoDetails(org, repo.name);
      logger.info(`Org ${org} repository ${repo.name} file details retrieved...`);
      const ci = getExtraInfoFile(files, config.CIFiles);
      const linterFile = getExtraInfoFile(files, config.linterFiles);
      const hasLinter = getExtraInfo(files, config.linterFiles);
      const hasTests = getExtraInfo(files, config.testFiles);
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
        await Promise.all(
          repositories.map(repo => addExtraParameters(org, repo)),
        );
      }
    };
    return { digestOrgsRepos };
  };
  return { start };
};
