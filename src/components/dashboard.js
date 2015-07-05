'use strict';

const React = require('react');

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      dataPoints: [
        { description: 'Courses', value: 147 },
        { description: 'Students', value: 10231 },
        { description: 'Instructors', value: 132 }
      ],
      faculties: [
        {
          name: 'Sprach-, Literatur- und Kulturwissenschaft',
          dataPoints: [
            { description: 'Courses', value: 146 },
            { description: 'Students', value: 146 },
            { description: 'Instructors', value: 146 }
          ]
        },
        {
          name: 'Philosophie-, Kunst-, Geistes- und Gesellschaftswissenschaften',
          dataPoints: [
            { description: 'Courses', value: 146 },
            { description: 'Students', value: 146 },
            { description: 'Instructors', value: 146 }
          ]
        },
        {
          name: 'Psychologie, Pädagogik und Sportwissenschaft',
          dataPoints: [
            { description: 'Courses', value: 146 },
            { description: 'Students', value: 146 },
            { description: 'Instructors', value: 146 }
          ]
        }
      ]
    };
  }

  render() {
    const dataPoints = this.state.dataPoints.map(dataPoint);

    const faculties = this.state.faculties.map(function(faculty) {
      const dataPoints = faculty.dataPoints.map(dataPoint);

      return (
        <div className="faculty">
          <div className="name">{faculty.name}</div>
          <div className="data-points">
            {dataPoints}
          </div>
        </div>
      );
    });

    function dataPoint(point) {
      return (
        <div className="data-point">
          <div className="value">{point.value}</div>
          <div className="description">{point.description}</div>
        </div>
      );
    }

    return (
      <div className="dashboard constrain-width">
        <h1>Dashboard</h1>
        <h2>Overview</h2>
        <section className="overview">
          {dataPoints}
        </section>
        <h2>Top Faculties</h2>
        <section className="faculties">
          {faculties}
        </section>
      </div>
    );
  }
}

module.exports = Dashboard;
