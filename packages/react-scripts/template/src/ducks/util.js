/**
 * create simple action that takes data and output {type, data} action
 * @param {*} type
 */
export function createAction(type) {
  return data => ({ type, data });
}

/**
 * basic reducer for replacing state all the time
 * @param {*} actionType action type key
 * @param {*} initState
 */
export function simpleReducer(type, initState) {
  return (state, action) =>
    action.type === type ? action.data : state || initState;
}

/**
 * reducer for data manipulation, support replace all, update and delete
 * @param {*} actionsTypes object indicates action type key 1. replaceActionType: replace whole state 2. updateActionType: update single/multiple items 3. deleteActionType: delete single item by id
 * @param {*} initState
 */
export function simpleDataSetReducer(
  { replaceActionType, updateActionType, deleteActionType, mergeActionType },
  initState
) {
  return (state, { type, data }) => {
    switch (type) {
      case replaceActionType:
        return data;
      case updateActionType:
        return { ...state, ...data };
      case deleteActionType:
        let newState = { ...state };
        delete newState[data];
        return newState;
      case mergeActionType:
        return { ...data, ...state };
      default:
        return state || initState;
    }
  };
}
