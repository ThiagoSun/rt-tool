import * as actions from './middleWare'

export default function composeMiddleWare(cb, filter, url, options) {
  const context = { filter, url, options };
  const middleWare = [];

  Object.keys(actions).forEach((key) => {
    const fn = actions[key];
    if (typeof fn === 'function') middleWare.push(fn);
  })
  return dispatch(0)(context)

  function dispatch(i) {
    return (ctx) => {
      const fn = middleWare[i];
      if (!fn) return cb(ctx);
      return fn(dispatch(i + 1), ctx)
    }
  }
}
