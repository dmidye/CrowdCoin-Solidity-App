const routes = require('next-routes')();

// next-routes is a library that allows us to define routes more simply
// the first argument to the add() function is the one the user will hit
// the second argument is the file path to the component representing that page.
// when making changes to this file, you must restart your server to see them in browser

routes.add('campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;