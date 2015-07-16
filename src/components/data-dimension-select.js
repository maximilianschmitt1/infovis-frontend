'use strict';

const React = require('react');
const SuperMenu = require('./super-menu');

const actions = require('../data/data-dimensions.json')
  .sort()
  .reduce((accu, item) => {
    const [context, action] = item.split(':');
    let latest = accu[accu.length - 1];

    if (!accu.length || latest.name !== context) {
      accu.push({ name: context, value: context, children: [] });
      latest = accu[accu.length - 1];
    }


    if (latest.name === context) {
      latest.children.push({ name: action, value: item });
    }

    return accu;
  }, []);
  //.map(action => { return { value: action, name: action }; });

const dimensions = [
  { value: 'none', name: '-' },
  { value: 'hits', name: 'Hits' },
  { value: 'uniques', name: 'Uniques' }
];

class DataDimensionSelect extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = { options: null };
  }

  componentDidMount() {
    const options = (!this.props.nullable ? dimensions : dimensions.slice(1)).concat(actions);
    this.setState({ options: options.map((option, i) => <option key={i} value={option.value}>{option.label}</option>) });
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  onChange(opt) {
    this.props.onChange(opt.value);
  }

  render() {
    const selected = this.props.selected;
    const options = (!this.props.nullable ? dimensions : dimensions.slice(1)).concat(actions);

    return (
      <div className="data-dimension-select-container">
        <SuperMenu highlightColor={this.props.highlightColor} options={options} onChange={this.onChange} selected={selected} />
      </div>
    );
  }
}

module.exports = DataDimensionSelect;
