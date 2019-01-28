import 'whatwg-fetch';
import composeMiddleWare from './composeMiddleWare';
import apiConfig from './apiConfig';
import { Toast } from 'antd-mobile';

const env = process.env.NODE_ENV || 'development';

export const preApi = apiConfig[env];

let cacheError;

const fetchUrl = []

const filterErrorCodeArray = [-700];

/**
 * 请求发出之前要先经过中间件处理
 * args包括url和options
 * composeMiddleWare 加载遍历中间件
 */
export const fetchAPI = (...args) => composeMiddleWare(fetchAction, preApi, ...args);

function fetchAction({ filter, url, options }) {
  let tempUrl = '';
  if (options.method !== 'GET') {
    tempUrl = options.method + url.split('?')[0];
    if (fetchUrl.indexOf(tempUrl) !== -1) {
      return;
    }
    fetchUrl.push(tempUrl);
  }
  cacheError = '';
  if (options.method === 'GET' && options.body) {
    url += `?${options.body}`;
    delete options.body;
  }
  return fetch(filter + url, options)
    .then((response) => {
      if (options.method !== 'GET') {
        const i = fetchUrl.indexOf(tempUrl);
        if (i !== -1) fetchUrl.splice(i, 1)
      }
      return response;
    })
    .then(checkStatus)
    .then(checkFileType)
    .then(checkCode)
}

export const apiMiddleWare = store => next => (action) => {
  if (cacheError) {
    if (cacheError.code === -700) {
      next({
        type: 'TOKEN_INVALID'
      });
      Toast.fail('Token失效', 3, () => {}, true);
    } else {
      next({
        type: 'ERROR',
        error: cacheError
      });
      env === 'development' && console.log('ERROR', cacheError);
      Toast.fail(JSON.stringfy(cacheError), 3, () => {}, true);
    }
  } else {
    next({
      type: 'GLOBAL_LOADING',
      response: '2'
    });
    Toast.hide();
  }
  next(action)
};

function checkCode(response) {
  if (response.Code !== 0) {
    return handleError(response.Code, response);
  }
  return response;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json().then(json => handleError(response.status, json));
}

function checkFileType(response) {
  const contentType = response.headers.get('content-type');
  if (contentType === 'text/csv' || contentType.indexOf('application/octet-stream') !== -1) {
    response.blob().then((blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      const fileNameStr = response.headers.get('content-disposition');
      const filename = fileNameStr.replace(/attachment;\s*filename=/, ''); // based on response HEADER
      a.href = url;
      a.download = decodeURIComponent(filename);
      a.click();
      window.URL.revokeObjectURL(url);
    });
    return { Code: 0 };
  }

  // otherwise it's a json response
  return response.json();
}

function handleError(code, response = '') {
  const error = new Error();
  error.code = code;
  error.response = response;
  if (filterErrorCodeArray.indexOf(code) !== -1) {
    cacheError = error;
  }
  throw error;
}

export function parseBody(body) {
  const type = Object.prototype.toString.call(body);
  if (type === '[object Null]' || type === '[object Undefined]' || type === '[object FormData]') {
    body = '';
  }
  if (type === '[object Object]' || type === '[object Array]') {
    body = JSON.stringify(body);
  }
  return body;
}

export const handleAPI = async (fn, dispatch) => {
  try {
    await dispatch({
      type: 'GLOBAL_LOADING',
      response: '1'
    });
    env === 'development' && console.log('GLOBAL_LOADING', '1');
    Toast.loading('加载中...', 0, () => {}, true);
    return await fn.call();
  } catch (error) {
    await dispatch({
      type: 'ERROR',
      error,
    });
    env === 'development' && console.log('ERROR', error);
    Toast.fail(JSON.stringify(error), 3, () => {}, true);
  }
}

