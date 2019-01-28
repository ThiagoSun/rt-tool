import React from 'react';
import {shouldComponentUpdate} from 'lib/decorators';
import {Drawer, NavBar, Icon} from 'antd-mobile';
import PropTypes from 'prop-types';
import Styles from './TopNavBar.less';

const Fragment = React.Fragment;

@shouldComponentUpdate
export default class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      firstClassIndex: 0
    };
  }

  static propTypes = {
    topNavBar: PropTypes.object,
    getCategoryData: PropTypes.func,
    onToggleCallback: PropTypes.func
  };

  static defaultProps = {};

  componentDidMount() {
    this.props.getCategoryData();
  }

  onOpenChange = () => {
    this.setState({drawerOpen: !this.state.drawerOpen});
    if (Object.prototype.toString.call(this.props.onToggleCallback === "[object Function]")){
      this.props.onToggleCallback();
    }
  }

  renderSideBar = () => {
    return (<Fragment>
      <div className={Styles['category-title']}><h3>全部分类</h3></div>
      <div className={Styles['category-container']}>
        <ul className={Styles['left-ul']}>
          {this.props.topNavBar.category.map((item, index) => {
            return (
              <li
                className={this.state.firstClassIndex === index ? Styles['item-active'] : Styles['item-closed']}
                key={`first-class-${item.id}`}
                onClick={this.handleFirstClassClick(index)}
              >{item.name}</li>
            )
          })}
        </ul>
        <div className={Styles['right-div']}>

        </div>
      </div>
    </Fragment>);
  }

  handleFirstClassClick = (index) => () => {
    this.setState({
      firstClassIndex: index
    })
  }

  render() {
    return (
      <Fragment>
        <NavBar icon={<Icon type="ellipsis"/>} onLeftClick={this.onOpenChange} className={Styles['top-navbar']}>
          <img
            src={'//gw.alicdn.com/tfs/TB1wQw8qamWBuNjy1XaXXXCbXXa-237-41.png_240x10000.jpg_.webp'}
            alt={'天猫Tmall'} className={Styles['tmall-img']}
          />
        </NavBar>
        <div className={Styles['drawer-container']}>
          <Drawer
            className={Styles["my-drawer"]}
            style={{minHeight: document.documentElement.clientHeight}}
            // enableDragHandle
            sidebar={this.renderSideBar()}
            open={this.state.drawerOpen}
            onOpenChange={this.onOpenChange}
          >{''}
          </Drawer>
        </div>
      </Fragment>
    );
  }
}
