'use strict';

const React = require('react');
const Chart = require('react-chartjs').Line;
const moment = require('moment');
const array = require('new-array');
const equal = require('deep-equal');
const color = require('color');
const colors = require('../vars').colors;

class GripsChart extends React.Component {
  componentDidUpdate() {
    if (this.mounted) {
      return;
    }

    const canvas = this.refs.chart.getCanvass();

    canvas.onmousemove = (e) => {
      const chart = this.refs.chart.getChart();
      const points = chart.getPointsAtEvent(e);

      if (this.props.resolution !== 'days' || !points.length) {
        canvas.style.cursor = 'default';
        return;
      }

      canvas.style.cursor = 'pointer';
    };

    canvas.onclick = (e) => {
      if (this.props.resolution !== 'days') {
        return;
      }

      const chart = this.refs.chart.getChart();
      const points = chart.getPointsAtEvent(e);

      if (!points.length) {
        return;
      }

      if (this.props.resolution === 'days') {
        const num = makeLabels(this.props.startTime, this.props.endTime, this.props.resolution).indexOf(points[0].label);
        this.zoom(num);
      }
    };

    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return !equal(this.props.dimensions, nextProps.dimensions);
  }

  zoom(num) {
    this.props.onZoom(num);
  }

  render() {
    const { startTime, endTime, resolution, dimensions } = this.props;

    if (!dimensions) {
      return null;
    }

    const datasets = dimensions.map(dataset).filter(dataset => !!dataset);
    const labels = makeLabels(startTime, endTime, resolution);

    return (
      <Chart
        ref="chart"
        redraw
        data={{ datasets, labels }}
        options={{ maintainAspectRatio: false, responsive: true, animation: false, multiTooltipTemplate: '<%= datasetLabel %>: <%= value %>' }}
        />
    );

  }
}

function dataset(dimension, i) {
  if (!dimension) {
    return null;
  }

  const baseColor = colors['dimension' + (i + 1)];

  return {
    data: dimension.data.map(dp => dp[dimension.dimension]),
    label: dimension.dimension,
    fillColor: color(baseColor).clearer(.75).rgbString(),
    pointColor: baseColor,
    strokeColor: baseColor,
    pointStrokeColor: baseColor,
    pointHighlightFill: '#fff'
  };
}

function makeLabels(startTime, endTime, resolution) {
  const formats = { hours: 'HH:mm', minutes: 'mm', days: 'MMMM Do' };
  const start = moment(startTime);
  const end = moment(endTime);

  return array(end.clone().add(1, 'days').diff(start, resolution))
    .map((we, i) => start.clone().add(i, resolution).format(formats[resolution]));
}

module.exports = GripsChart;
