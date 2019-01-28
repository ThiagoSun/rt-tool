import { handleAPI, fetchAPI } from 'lib/utils';
// ------------------------------------
// Constants
// ------------------------------------
export const GLOBAL_INIT = 'GLOBAL_INIT'
export const GLOBAL_INIT_SUCCESS = 'GLOBAL_INIT_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export const getGlobalInitInfo = (params) => {
  return (dispatch) => {
    handleAPI(async () => {
      await dispatch({
        type: GLOBAL_INIT
      });

      const response = await getGlobalInitInfoAPI({
        payload: {
          date: new Date().getTime()
        }
      });
      await dispatch({
        type: GLOBAL_INIT_SUCCESS,
        appInfo: response.Result
      });
    }, dispatch);
  }
}

const getGlobalInitInfoAPI = async ({ payload }) => {
  return await fetchAPI('api/global/version', {
    method: 'GET',
    body: payload
  });
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GLOBAL_INIT_SUCCESS] : (state, action) => {
    return Object.assign({}, state, {
      appInfo: action.appInfo
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  appName: 'tmall',
  appInfo: ''
};
export default function globalStoreReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
