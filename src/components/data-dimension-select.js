'use strict';

const React = require('react');

class DataDimensionSelect extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = { options: null };
  }

  componentDidMount() {
    this.setState({ options: this.props.options.map((option, i) => <option key={i} value={option.value}>{option.label}</option>) });
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  onChange(e) {
    const value = e.target.value;
    this.props.onChange(value);
  }

  render() {
    const selected = this.props.selected;
    const options = this.state.options;

    return (
      <div className="data-dimension-select-container">
        <select onChange={this.onChange} value={selected}>
          {options}
        </select>
      </div>
    );
  }
}

module.exports = DataDimensionSelect;
