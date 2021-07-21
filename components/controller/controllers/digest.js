module.exports = () => {
  const start = async ({ logger, github, store, config }) => {
    const repoDetails = async (org, repoName) => {
      const { data: repositoryFiles } = await github.getRepoContent({
        urlParams: {
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
      const file = files.find(file => (
        exceptions.includes(file.path)
      ))
      return file ? file.path : null;
    };

    const addExtraParameters = async (org, repo) => {
      const files = await repoDetails(org, repo.name);
      const ci = getExtraInfoFile(files, config.CIFiles);
      const linter_file = getExtraInfoFile(files, config.linterFiles);
      const has_linter = getExtraInfo(files, config.linterFiles);
      const has_tests = getExtraInfo(files, config.testFiles);
      const completedRepo = {
        ...repo,
        ci,
        linter_file,
        has_linter,
        has_tests,
      };
      return store.saveRepository(completedRepo);
    };

    const digestOrgsRepos = async org => {
      logger.info(`Digesting organization repositories ${org}`);
      const { data: repositories } = await github.getRepos({
        urlParams: {
          org,
        },
        params: {
          type: 'public',
          sort: 'updated',
        },
      });
      return Promise.all(
        repositories.map(repo => addExtraParameters(org, repo)),
      );
    };
    return { digestOrgsRepos };
  };
  return { start };
};
