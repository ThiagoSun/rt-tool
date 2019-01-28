import { handleAPI, fetchAPI } from 'lib/utils';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CATEGORY_DATA = 'GET_CATEGORY_DATA';
export const GET_CATEGORY_DATA_SUCCESS = 'GET_CATEGORY_DATA_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
export const getCategoryData = () => {
  return (dispatch) => {
    handleAPI(async () => {
      await dispatch({
        type: GET_CATEGORY_DATA
      });

      const response = await getCategoryDataAPI();
      await dispatch({
        type: GET_CATEGORY_DATA_SUCCESS,
        category: response.Result.category
      });
    }, dispatch);
  }
}

const getCategoryDataAPI = async () => {
  return await fetchAPI('api/global/category', {
    method: 'GET'
  });
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_CATEGORY_DATA_SUCCESS] : (state, action) => {
    return Object.assign({}, state, {
      category: action.category
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  category: []
};
export default function topNavBarReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
