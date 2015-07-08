'use strict';

const React = require('react');
const Router = require('react-router');
const Route = Router.Route;

const App = require('./components/app');
const Dashboard = require('./components/dashboard');
const Explore = require('./components/explore');
const TestComponent = require('./components/test-component');

console.log('environment:', process.env.NODE_ENV);

(function() {
  //React.render(<TestComponent />, document.querySelector('.app'));
//
  //return;

  const routes = (
    <Route handler={App}>
      <Route name="dashboard" path="/" handler={Dashboard} />
      <Route name="explore" path="/explore" handler={Explore} />
    </Route>
  );

  Router.run(routes, function(Root, state) {
    React.render(<Root />, document.querySelector('.app'));
  });
})();

