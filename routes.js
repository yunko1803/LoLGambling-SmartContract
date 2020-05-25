const routes = require('next-routes')();

routes.add('/admin', '/admin').add('/matches/:address', '/matches/show');

module.exports = routes;
