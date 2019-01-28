import React from 'react';
import PropTypes from 'prop-types';

export default class GlobalStore extends React.Component {
  static propTypes = {
    globalStore: PropTypes.object,
    children: PropTypes.element.isRequired,
    getGlobalInitInfo: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  componentDidMount() {
    this.props.getGlobalInitInfo();
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    })
  }

  render() {
    if (this.state.hasError) {
      return '页面崩溃了...刷新试试吧！'
    }
    return this.props.children;
  }
}
