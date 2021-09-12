const repositoryToDB = repo => ({
  id: repo.id,
  name: repo.name,
  url: repo.url,
  description: repo.description,
  created_at: repo.created_at,
  updated_at: repo.updated_at,
  size: repo.size,
  org: repo.org,
  stargazers_count: repo.stargazers_count,
  watchers_count: repo.watchers_count,
  language: repo.language,
  has_issues: repo.has_issues,
  has_projects: repo.has_projects,
  has_downloads: repo.has_downloads,
  has_wiki: repo.has_wiki,
  has_pages: repo.has_pages,
  forks_count: repo.forks_count,
  open_issues_count: repo.open_issues_count,
  archived: repo.archived,
  disabled: repo.disabled,
  default_branch: repo.default_branch,
  license_key: repo.license ? repo.license.key : null,
  license_name: repo.license ? repo.license.name : null,
  license_url: repo.license ? repo.license.url : null,
  ci: repo.ci,
  linter_file: repo.linter_file,
  has_linter: repo.has_linter,
  has_tests: repo.has_tests,
});

const repositoryToBO = repository => ({
  name: repository.name,
  url: repository.url,
  description: repository.description,
  updatedAt: repository.updated_at,
  size: repository.size,
  hasIssues: repository.has_issues,
  hasLinter: repository.has_linter,
  hasTests: repository.has_tests,
  ci: repository.ci,
});

module.exports = {
  repositoryToDB,
  repositoryToBO,
};
