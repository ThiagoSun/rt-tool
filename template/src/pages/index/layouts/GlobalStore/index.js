import { connect } from 'react-redux';
import GlobalStore from './GlobalStore';
import { getGlobalInitInfo } from './modules/globalStore';

const mapDispatchToProps = {
  getGlobalInitInfo
}

const mapStateToProps = state => ({
  globalStore: state.globalStore
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalStore)
