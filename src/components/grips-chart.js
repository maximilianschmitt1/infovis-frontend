'use strict';

const React = require('react');
const Chart = require('react-chartjs').Bar;
const apiUrl = require('../config').apiUrl;
const moment = require('moment');
const axios = require('axios');
const colors = require('../vars').colors;

const dimensionNames = ['dimension1', 'dimension2', 'dimension3'];

class GripsChart extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.fetch(this.props);
  }

  componentWillReceiveProps(props) {
    this.fetch(props);
  }

  shouldComponentUpdate(props, state) {
    let loading = false;

    dimensionNames.forEach(dimensionName => {
      if (state[dimensionName] && state[dimensionName].loading) {
        loading = true;
      }
    });

    return !loading;
  }

  fetch(opts) {
    ['dimension1', 'dimension2', 'dimension3'].forEach(dimensionName => {
      if (!opts[dimensionName]) {
        const state = {};
        state[dimensionName] = null;
        return this.setState(state);
      }

      const state = {};
      state[dimensionName] = { loading: true };
      this.setState(state);

      this.getData(opts[dimensionName], opts).then(updateState.bind(this));

      function updateState(res) {
        const state = {};
        state[dimensionName] = { dimensionName, dimension: opts[dimensionName], data: res.data, loading: false };
        this.setState(state);
      }
    });
  }

  getData(dimension, opts) {
    const { startTime, endTime, resolution } = opts;
    return axios.get(apiUrl + `/count/${dimension}/between/${startTime}/${endTime}?resolution=${resolution}`);
  }

  render() {
    const chart = (function() {
      const datasets = dimensionNames
        .filter(dimensionName => !!this.state[dimensionName])
        .map(dimension => {
          const what = this.state[dimension];
          what.fillColor = colors[what.dimensionName];
          what.label = what.dimension;
          return what;
        });

      if (!datasets[0] || this.state.loading) {
        return null;
      }

      const chartData = {
        labels: datasets[0].data.map(dp => label(this.props.resolution, dp.time)),
        datasets: datasets.map(dataset => {
          dataset.data = dataset.data.map(dp => dp[dataset.label]);
          return dataset;
        })
      };

      return <Chart redraw data={chartData} height="400" />;
    }.bind(this))();

    return <div className="chart">{chart}</div>;
  }
}

function label(resolution, time) {
  if (resolution === 'hours') {
    return moment(time).format('HH');
  }

  if (resolution === 'minutes') {
    return moment(time).format('mm');
  }

  return moment(time).format('MMMM Do');
}

module.exports = GripsChart;
