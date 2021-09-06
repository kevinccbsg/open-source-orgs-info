const { join } = require('path');
const Systemic = require('systemic');

const controllers = require('require-all')(join(__dirname, 'controllers'));

module.exports = new Systemic({ name: 'controller' })
  .add('controller.digest', controllers.digest())
  .dependsOn('config', 'logger', 'github', 'store')
  .add('controller.orgs', controllers.orgs())
  .dependsOn('logger', 'store')
  .add('controller')
  .dependsOn({
    component: 'controller.digest',
    destination: 'digest',
  }, {
    component: 'controller.orgs',
    destination: 'orgs',
  });
