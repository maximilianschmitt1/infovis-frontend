'use strict';

const debounce = require('debounce');
const moment = require('moment');
const React = require('react');
const GripsChart = require('./grips-chart');
const DateRangePicker = require('./date-range-picker');
const actions = require('../data/data-dimensions.json').sort();
const formatNumber = require('format-number')();
const counts = require('../stores/counts');

const dataOptions = [
  { value: 'none', label: '-' },
  { value: 'hits', label: 'Hits' },
  { value: 'uniques', label: 'Uniques' }
].concat(actions.map(action => { return { value: action, label: action }; }));

class Explore extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      startTime: '2015-03-01',
      endTime: '2015-03-15',
      dimensions: ['hits', null, null]
    };

    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.fetchCounts = debounce(this.fetchCounts, 200).bind(this);
  }

  componentDidMount() {
    this.fetchCounts();
  }

  onZoom(num) {
    const startTime = moment(this.state.startTime).clone().add(num, 'days').format('YYYY-MM-DD');
    const endTime = startTime;
    this.setState({ loading: true, startTime, endTime }, this.fetchCounts);
  }

  fetchCounts() {
    const opts = { startTime: this.state.startTime, endTime: this.state.endTime };
    opts.resolution = moment(this.state.endTime).diff(this.state.startTime, 'days') > 0 ? 'days' : 'hours';
    return Promise
      .all(this.state.dimensions.map(dimension => dimension && counts.get(dimension, opts)))
      .then(counts => this.setState({ loading: false, counts }));
  }

  onChangeDateRange(range) {
    this.setState({ startTime: range.start, endTime: range.end, loading: true }, this.fetchCounts);
  }

  onChangeDimension(num, e) {
    const dimensions = this.state.dimensions;
    const value = e.target.value;
    dimensions[num] = value === 'none' ? null : value;
    this.setState({ dimensions, loading: true }, this.fetchCounts);
  }

  render() {
    const { startTime, endTime, dimensions, counts, loading } = this.state;
    const resolution = moment(endTime).diff(startTime, 'days') > 0 ? 'days' : 'hours';

    const selects = dimensions.map((dimensionKey, i) => {
      const changeFunction = this.onChangeDimension.bind(this, i);

      const options = (i === 0 ? dataOptions.slice(1) : dataOptions)
        .map((option, i) => <option key={i} value={option.value}>{option.label}</option>);

      const dataInfo = !loading && counts && counts[i] && (function() {
        const total = counts[i].data.map(dp => dp[dimensionKey]).reduce((dp1, dp2) => dp1 + dp2, 0);
        const num = counts[i].data.length;
        const average = Math.round(total / num);
        const units = resolution;
        const unit = resolution.substr(0, resolution.length - 1);
        return (
          <div className="mini-stats">
            <p><strong>{formatNumber(total)}</strong> over <strong>{num} {units}</strong></p>
            <p><strong>~{formatNumber(average)}</strong> per <strong>{unit}</strong></p>
          </div>
        );
      })();

      return (
        <div key={i} className="dimensions-container">
          <div className="select-container">
            <select onChange={changeFunction} value={dimensionKey}>
              {options}
            </select>
          </div>
          {dataInfo}
        </div>
      );
    });

    const loadingIndicator = loading ? <div className="loading-indicator" /> : null;

    return (
      <div className="explore">
        <h1>Explore</h1>

        <nav className="date-range">
          <DateRangePicker
            start={startTime}
            end={endTime}
            onChange={this.onChangeDateRange}
            max="2015-04-22"
            min="2015-02-21"
            resolution="days"
            />
        </nav>

        <div className="chart-container">
          {loadingIndicator}
          <GripsChart
            onZoom={this.onZoom}
            startTime={startTime}
            endTime={endTime}
            dimensions={counts}
            resolution={resolution}
            />
        </div>

        <nav className="data-dimensions toolbar">
          {selects}
        </nav>
      </div>
    );
  }
}

module.exports = Explore;
