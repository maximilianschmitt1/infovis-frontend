'use strict';

const React = require('react');
const formatNumber = require('format-number')();

class DataDimensionStats extends React.Component {
  render() {
    const { counts, resolution, dimension, loading } = this.props;

    if (loading || counts === null) {
      return <div className="data-dimension-stats"><p>&nbsp;</p></div>;
    }

    const total = counts.map(dp => dp[dimension]).reduce((dp1, dp2) => dp1 + dp2, 0);
    const num = counts.length;
    const average = Math.round(total / num);
    const units = resolution;
    const unit = resolution.substr(0, resolution.length - 1);

    return (
      <div className="data-dimension-stats">
        <p>
          <strong>{formatNumber(total)}</strong> over <strong>{num} {units}</strong>,
          &nbsp;
          <strong>~{formatNumber(average)}</strong> / <strong>{unit}</strong>
        </p>
      </div>
    );
  }
}

module.exports = DataDimensionStats;
