const Systemic = require('systemic');
const adminRoutes = require('./admin-routes');
const apiRoutes = require('./api-routes');

module.exports = new Systemic({ name: 'routes' })
  .add('routes.admin', adminRoutes())
  .dependsOn('config', 'logger', 'app', 'manifest')
  .add('routes.api', apiRoutes())
  .dependsOn('config', 'logger', 'app', 'middleware.prepper', 'controller')
  .add('routes')
  .dependsOn('routes.admin', 'routes.api');
