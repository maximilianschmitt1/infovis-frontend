'use strict';

const React = require('react');
const formatNumber = require('format-number')();
const Chart = require('react-chartjs').Pie;
const randomColor = require('randomcolor');

const top10Actions = [
  { label: 'course:view', value: 1417221 },
  { label: 'resource:view', value: 644713 },
  { label: 'user:login', value: 358676 },
  { label: 'role:unassign', value: 124674 },
  { label: 'user:logout', value: 113870 },
  { label: 'role:assign', value: 107458 },
  { label: 'course:enrol', value: 93292 },
  { label: 'folder:view', value: 73907 },
  { label: 'quiz:continue_attempt', value: 52764 },
  { label: 'forum:view_forum', value: 52149 }
].map(action => {
  action.color = randomColor({});
  return action;
});

const users = [
  { label: 'Students', value: 23664 },
  { label: 'Instructors', value: 3689 }
].map(user => {
  user.color = randomColor({});
  return user;
});

const days = [
  { label: 'April 14th 2015', value: 191911 },
  { label: 'Average hits per day', value: 61322 }
].map(day => {
  day.color = randomColor({});
  return day;
});

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      dataPoints: [
        { description: 'Days', value: 60 },
        { description: 'Courses', value: 11571 },
        { description: 'Users', value: 27353 }
      ]
    };
  }

  render() {
    const topActionsRows = top10Actions.map(dataRow);
    const dataPoints = this.state.dataPoints.map(dataPoint);

    function dataRow(row, i) {
      return (
        <tr key={i}>
          <td className="label"><div className="color-legend" style={{ backgroundColor: row.color }} />{row.label}</td>
          <td className="value">{formatNumber(row.value)}</td>
        </tr>
      );
    }

    function percentageBar(all, row) {
      const total = all.map(row => row.value).reduce((acc, curr) => acc + curr, 0);
      const percentage = (row.value / total) * 100;

      return (
        <tr className="percentage-bar">
          <td colSpan="2">
            <div className="bar" style={{ width: percentage + '%', backgroundColor: row.color }} />
          </td>
        </tr>
      );
    }

    function dataPoint(point, i) {
      return (
        <div key={i} className="data-point">
          <div className="value">{formatNumber(point.value)}</div>
          <div className="description">{point.description}</div>
        </div>
      );
    }

    return (
      <div className="dashboard constrain-width">
        <h2>Overview</h2>
        <section className="overview">
          {dataPoints}
        </section>
        <h2>Users</h2>
        <section className="users">
          <div className="table">
            <table className="with-bars">
              {dataRow(users[0])}
              {percentageBar(users, users[0])}
              {percentageBar(users, users[1])}
              {dataRow(users[1])}
            </table>
          </div>
        </section>
        <h2>Top 10 Actions (of 242)</h2>
        <section className="top-10-actions">
          <div className="table">
            <table>
              {topActionsRows}
            </table>
          </div>
          <div className="chart">
            <Chart data={top10Actions} options={{ responsive: true, animation: false }} />
          </div>
        </section>
        <h2>Busiest day (hits)</h2>
        <section className="busiest-day">
          <div className="table">
            <table className="with-bars">
              {dataRow(days[0])}
              {percentageBar(days, days[0])}
              {percentageBar(days, days[1])}
              {dataRow(days[1])}
            </table>
          </div>
        </section>
      </div>
    );
  }
}

module.exports = Dashboard;
