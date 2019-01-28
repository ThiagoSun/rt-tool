import Immutable from 'immutable';

export function shouldComponentUpdate(target) {
  target.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return !Immutable.is(Immutable.fromJS(nextProps), Immutable.fromJS(this.props)) ||
      !Immutable.is(Immutable.fromJS(nextState), Immutable.fromJS(this.state))
  }
}
