module.exports = () => {
  const start = async ({
    logger, store,
  }) => {
    const fetch = async orgName => {
      logger.info(`Retrieving ${orgName} repositories`);
      const repos = await store.getRepositories();
      logger.info(`sending ${repos.length} for org ${orgName}`);
      return repos;
    };

    return { fetch };
  };
  return { start };
};
