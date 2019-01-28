import { preApi, parseBody } from '../utils'

export default function handleContentType(cb, ctx) {
  const bodyType = Object.prototype.toString.call(ctx.options.body);
  if (bodyType === '[object FormData]') {
    ctx.options.method = 'POST';
    ctx.options.headers = Object.assign({}, ctx.options.headers, {
      enctype: 'multipart/form-data'
    });
  } else {
    switch (ctx.filter) {
      case preApi:
        /**
         * 暂无服务端时，使用Get方式请求json假数据
         * @type {string}
         */
        ctx.options.method = 'GET';
        ctx.options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        ctx.url = ctx.url + '.json';
        if (ctx.options.body) {
          ctx.options.body = `Body=${encodeURIComponent(parseBody(ctx.options.body))}`;
        }
        break;
      default:
        ctx.options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        if (ctx.options.body) {
          ctx.options.body = `Body=${encodeURIComponent(parseBody(ctx.options.body))}`;
        }
        break;
    }
  }
  return cb(ctx);
}
