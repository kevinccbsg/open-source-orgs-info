/**
 * Request params to digest a repository in our systems
 * @typedef {object} DigestRequest
 * @property {string} org.required - Organization or user github name
 */

/**
 * Repositories Response
 * @typedef {object} RepositoriesResponse
 * @property {string} name.required - Repository name
 * @property {string} url.required - Repository url
 * @property {string|null} description.required - Repository description
 * @property {string} updatedAt.required - When Repository was updated
 * @property {integer} size.required - Repository file size
 * @property {boolean} hasIssues.required - Repository includes issues
 * @property {boolean} hasLinter.required - Repository includes linter
 * @property {boolean} hasTests.required - Repository includes tests
 * @property {string|null} ci.required - Repository ci configuration
 */
