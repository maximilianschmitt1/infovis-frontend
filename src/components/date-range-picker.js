'use strict';

const React = require('react');
const moment = require('moment');
const array = require('new-array');
const classnames = require('classnames');

class DateRangePicker extends React.Component {
  constructor() {
    super();
    this.state = { selectionStart: null, selectionEnd: null };
  }

  componentDidMount() {
    this.calculate(this.props);
  }

  componentWillReceiveProps(props) {
    this.calculate(props);
  }

  moveSelection(date) {
    if (!this.state.selectionStart) {
      return;
    }

    this.setState({ selectionEnd: date });
  }

  startSelection(date) {
    this.setState({ selectionStart: date });
    console.log('start', date.format('YYYY-MM-DD'));
  }

  endSelection(date) {
    if (!this.state.selectionStart) {
      return;
    }

    this.props.onChange({
      start: this.state.selectionStart.format('YYYY-MM-DD'),
      end: date.format('YYYY-MM-DD')
    });

    this.setState({ selectionStart: null, selectionEnd: null });
  }

  calculate(opts) {
    const { start, end, min, max, resolution } = opts;
    const mstart = moment(start);
    const mend = moment(end);
    const mmin = moment(min);
    const mmax = moment(max);
    const num = mend.diff(mstart, resolution);
    const numAvailable = mmax.diff(mmin, resolution);
    const dates = array(num).map((we, i) => mstart.clone().add(i, resolution));
    const available = array(numAvailable).map((we, i) => mmin.clone().add(i, resolution));
    this.setState({ dates, available });
  }

  render() {
    if (!this.state || !this.state.available) {
      return <div className="date-range-picker" />;
    }

    const { available, selectionStart, selectionEnd } = this.state;
    const { start, end } = this.props;
    const days = available.map(renderDay.bind(this, 'day', 'DD'));
    const weekdays = available.map(renderDay.bind(this, 'weekday', 'dd'));

    function renderDay(customClass, format, date, i) {
      const weekday = date.isoWeekday();
      const selected = (date.isBetween(selectionStart, selectionEnd) || date.isSame(selectionStart) || date.isSame(selectionEnd));
      const inRange = (date.isBetween(start, end) || date.isSame(start) || date.isSame(end));
      const rangeStart = date.isSame(start);
      const rangeEnd = date.isSame(end);
      const weekend = weekday === 6 || weekday === 7;
      const classes = {
        weekend,
        selected,
        'in-range': inRange,
        'range-end': rangeEnd,
        'range-start': rangeStart
      };

      classes[customClass] = true;

      return (
        <td
          onMouseDown={this.startSelection.bind(this, date)}
          onMouseMove={this.moveSelection.bind(this, date)}
          onMouseUp={this.endSelection.bind(this, date)}
          className={classnames(classes)}
          key={i}>
            {date.format(format)}
        </td>
      );
    }

    const months = available.reduce((accu, curr) => {
      const prev = accu[accu.length - 1];
      const month = curr.month();
      const year = curr.year();

      if (prev && month === prev.month && year === prev.year) {
        prev.days.push(curr);
        return accu;
      }

      accu.push({ date: curr, month, year, days: [curr] });
      return accu;
    }, []).map((month, i) => <td className="month" key={i} colSpan={month.days.length}>{month.date.format('MMMM')}</td>);

    return (
      <div className="date-range-picker">
        <table>
          <tr>{months}</tr>
          <tr>{weekdays}</tr>
          <tr>{days}</tr>
        </table>
      </div>
    );
  }
}

module.exports = DateRangePicker;
