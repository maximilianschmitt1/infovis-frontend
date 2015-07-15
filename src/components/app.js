'use strict';

const React = require('react');
const Router = require('react-router')
const RouteHandler = Router.RouteHandler;
const Link = Router.Link;

class App extends React.Component {
  render() {
    return (
      <div>
        <header className="app-header">
          <div className="app-name">
            <h1>
              <Link to="dashboard">GRIPS Analytics</Link>
            </h1>
          </div>
          <nav>
            <Link to="dashboard">Dashboard</Link>
            <Link to="explore">Explore</Link>
          </nav>
        </header>
        <main className="app-body">
          <RouteHandler />
        </main>
      </div>
    );
  }
}

module.exports = App;
