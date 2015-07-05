'use strict';

const React = require('react');
const GripsChart = require('./grips-chart');
const dataDimensions = require('../data/data-dimensions.json').sort();
const debounce = require('debounce');

const dataOptions = [
  { value: 'none', label: '-' },
  { value: 'hits', label: 'Hits' },
  { value: 'uniques', label: 'Uniques' }
].concat(dataDimensions.map(dimension => { return { value: dimension, label: dimension }; }));

class Explore extends React.Component {
  constructor() {
    super();

    this.state = {
      startTime: '2015-03-01',
      endTime: '2015-03-15',
      dataDimension1: 'hits',
      dataDimension2: null,
      dataDimension3: null
    };

    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
  }

  onChangeStartTime(e) {
    const startTime = e.target.value;
    this.setState({ startTime });
  }

  onChangeEndTime(e) {
    const endTime = e.target.value;
    this.setState({ endTime });
  }

  onChangeDataDimension1(e) {
    this.setState({ dataDimension1: e.target.value });
  }

  onChangeDataDimension2(e) {
    const value = e.target.value;
    this.setState({ dataDimension2: value === 'none' ? null : value });
  }

  onChangeDataDimension3(e) {
    const value = e.target.value;
    this.setState({ dataDimension3: value === 'none' ? null : value });
  }

  render() {
    const { startTime, endTime, dataDimension1, dataDimension2, dataDimension3 } = this.state;

    const dataSelects = [null, null, null].map((val, i) => {
      const value = this.state['dataDimension' + (i + 1)];
      const changeFunction = this['onChangeDataDimension' + (i + 1)].bind(this);
      const options = dataOptions.map(function(option, i) {
        return <option key={i} value={option.value}>{option.label}</option>;
      });

      if (i === 0) {
        options.shift();
      }

      return (
        <div className="dimension-wrapper">
          <select key={i} onChange={changeFunction} value={value}>
            {options}
          </select>
        </div>
      );
    });
    return (
      <div className="explore">
        <h1>Explore</h1>
        <nav className="date-range">
          <input type="date" ref="start-time" value={startTime} onChange={this.onChangeStartTime} />
          <input type="date" ref="end-time" value={endTime} onChange={this.onChangeEndTime} />
        </nav>

        <GripsChart
          startTime={startTime}
          endTime={endTime}
          dimension1={dataDimension1}
          dimension2={dataDimension2}
          dimension3={dataDimension3}
          resolution="days"
          what="hits" />
        <nav className="data-dimensions toolbar">
          {dataSelects}
        </nav>
      </div>
    );
  }
}

module.exports = Explore;
