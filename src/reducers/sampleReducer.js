export default (state = {}, action) => {
    switch (action.type) {
     case 'GET_QUESTION_LIST':
      return action.actionParameter
     default:
      return state
    }
   }