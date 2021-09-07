module.exports = () => {
  const start = async ({
    logger, store,
  }) => {
    const fetch = async (orgName, filters) => {
      logger.info(`Retrieving ${orgName} repositories`);
      const repos = await store.getRepositories(orgName, filters);
      logger.info(`sending ${repos.length} for org ${orgName}`);
      return repos;
    };

    return { fetch };
  };
  return { start };
};
