'use strict';

const React = require('react');
const DataDimensionSelect = require('./data-dimension-select');
const array = require('new-array');
const options = array(400).map((we, i) => { return { value: i, label: i }; });

class TestComponent extends React.Component {
  constructor() {
    super();
    this.state = { dimension: 2 };
  }

  onChangeDimension(value) {
    this.setState({ dimension: value });
  }

  render() {
    const dimension = this.state.dimension;
    return <DataDimensionSelect selected={dimension} options={options} onChange={this.onChangeDimension.bind(this)} />;
  }
}

module.exports = TestComponent;
