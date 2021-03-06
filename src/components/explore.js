'use strict';

const React = require('react');
const debounce = require('debounce');
const moment = require('moment');
const assign = require('object.assign');
const array = require('new-array');
const randomColor = require('randomcolor');
const counts = require('../stores/counts');
const GripsChart = require('./grips-chart');
const DateRangePicker = require('./date-range-picker');
const DataDimensionSelect = require('./data-dimension-select');
const DataDimensionFilter = require('./data-dimension-filter');
const DataDimensionStats = require('./data-dimension-stats');

class Explore extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      startTime: '2015-03-01',
      endTime: '2015-03-15',
      dimensions: ['hits', 'none', 'none'],
      filters: ['none', 'none', 'none'],
      //colors: array(3).map(randomColor.bind(null, { luminosity: 'light' }))
      colors: ['#80a4ed', '#FFE39B', '#ed8eb8']
    };

    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.fetchCounts = debounce(this.fetchCounts, 200).bind(this);
  }

  componentDidMount() {
    this.fetchCounts();
  }

  onChangeFilter(i, value) {
    const filters = this.state.filters;
    filters[i] = value;
    this.setState({ filters, loading: true }, this.fetchCounts);
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
      .all(this.state.dimensions.map((dimension, i) => {
        if (dimension === 'none') {
          return null;
        }

        const filter = this.state.filters[i];

        return counts.get(dimension, assign({ filter }, opts));
      }))
      .then(counts => this.setState({ loading: false, counts }))
      .catch(handleError);

    function handleError(err) {
      console.log(err && err.stack);
    }
  }

  onChangeDateRange(range) {
    this.setState({ startTime: range.start, endTime: range.end, loading: true }, this.fetchCounts);
  }

  onChangeDimension(num, value) {
    const dimensions = this.state.dimensions;
    dimensions[num] = value;
    this.setState({ dimensions, loading: true }, this.fetchCounts);
  }

  render() {
    const { startTime, endTime, dimensions, counts, loading, filters, colors } = this.state;
    const resolution = moment(endTime).diff(startTime, 'days') > 0 ? 'days' : 'hours';

    const selects = dimensions.map((dimension, i) => {
      const color = colors[i];
      const filter = filters[i];

      return (
        <div key={i} className="data-dimension-container">
          <div>
            <DataDimensionSelect highlightColor={color} selected={dimension} nullable={i === 0} onChange={this.onChangeDimension.bind(this, i)} />
            <DataDimensionFilter selected={filter} onChange={this.onChangeFilter.bind(this, i)} />
            <DataDimensionStats loading={loading} counts={counts && counts[i] ? counts[i].data : null} resolution={resolution} dimension={dimension} />
          </div>
        </div>
      );
    });

    return (
      <div className="explore">
        <div className="chart-container">
          {loading ? <div className="loading-indicator" /> : null}
          <GripsChart
            onZoom={this.onZoom}
            startTime={startTime}
            endTime={endTime}
            dimensions={counts}
            colors={colors}
            resolution={resolution}
            />
        </div>

        <nav className="date-range">
          <DateRangePicker
            start={startTime}
            end={endTime}
            onChange={this.onChangeDateRange}
            max="2015-04-21"
            min="2015-02-21"
            resolution="days"
            />
        </nav>

        <nav className="data-dimensions toolbar">
          {selects}
        </nav>
      </div>
    );
  }
}

module.exports = Explore;
