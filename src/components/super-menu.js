'use strict';

const React = require('react');
const assign = require('object.assign');

class SuperMenu extends React.Component {
  constructor() {
    super();
    this.select = this.select.bind(this);
    this.state = { options: [], optsMap: {} };
  }

  componentDidMount() {
    this.makeOptsMap(this.props.options);
  }

  makeOptsMap(opts) {
    const withParents = opts.map(function mapParents(opt) {
      if (opt.children) {
        const parent = {
          name: opt.name,
          value: opt.value,
          parent: opt.parent
        };

        parent.children = opt.children.map(child => mapParents(assign({ parent }, child)));

        return parent;
      }

      return assign({}, opt);
    });

    const optsMap = withParents.reduce(function assignToMap(map, opt) {
      map[opt.value] = opt;

      if (opt.children) {
        return opt.children.reduce(assignToMap, map);
      }

      return map;
    }, {});

    this.setState({ options: withParents, optsMap });
  }

  goTo(opt) {
    this.refs.itemList.getDOMNode().scrollTop = 0;
    this.setState({ showing: opt });
  }

  select(opt) {
    this.setState({ showing: opt.parent });
    this.props.onChange(opt);
  }

  render() {
    if (!this.props.selected) {
      return null;
    }

    const items = (this.state.showing && this.state.showing.children) || this.state.options;
    const selected = this.state.optsMap[this.props.selected];

    const breadcrumbs = (() => {
      const end = selected && selected.parent;

      const crumbs = (function gatherCrumbs(all, curr) {
        if (!curr) {
          return all;
        }

        all.unshift(curr);

        if (curr.parent) {
          return gatherCrumbs(all, curr.parent);
        }

        return all;
      })([], end).map(opt => {
        const classes = [];

        if (this.state.showing && opt.value === this.state.showing.value) {
          classes.push('showing');
        }

        return <a className={classes.join(' ')} key={opt.value} onClick={this.goTo.bind(this, opt)}>{opt.name}</a>;
      });

      crumbs.unshift(<a className={!this.state.showing ? 'showing' : ''} key="root" onClick={this.goTo.bind(this, null)}>/</a>);
      crumbs.unshift('Selected: ');

      return (
        <nav className="breadcrumbs">
          {crumbs}
          {selected && <span style={{ background: this.props.highlightColor }}>{selected.name}</span>}
        </nav>
      );
    })();

    return (
      <div className="super-menu">
        {breadcrumbs}
        <ul ref="itemList">
          {items.map(renderOpt.bind(this))}
        </ul>
      </div>
    );

    function renderOpt(opt, i) {
      const classes = [];
      const style = {};
      const onClick = opt.children ? this.goTo : this.select;

      if (opt.children) {
        classes.push('has-children');
      }

      if (!opt.children && opt.value === this.props.selected) {
        classes.push('selected');
        style.background = this.props.highlightColor;
      }

      return (
        <li style={style} key={i} onClick={onClick.bind(this, opt)} className={classes.join(' ')}>{opt.name}</li>
      );
    }
  }
}

module.exports = SuperMenu;
