'use strict';

const React = require('react');
const RadioGroup = require('react-radio-group');

class DataDimensionFilter extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  onChange(value) {
    this.props.onChange(value);
  }

  render() {
    const value = this.props.selected;

    return (
      <div className="data-dimension-filter">
        <RadioGroup selectedValue={value} onChange={this.onChange}>
          {Radio => (
            <p>
              <label><Radio value="none" /> All</label>
              <label><Radio value="students" /> Students</label>
              <label><Radio value="instructors" /> Instructors</label>
            </p>
          )}
        </RadioGroup>
      </div>
    );
  }
}

module.exports = DataDimensionFilter;
