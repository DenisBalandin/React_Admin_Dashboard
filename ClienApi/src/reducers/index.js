import {USERS_ITEMS} from "../constants/action-types";
import {ACCESS_TOKEN} from "../constants/action-types";
import {CHANGE_USER} from "../constants/action-types";
import {DELETE_USER} from "../constants/action-types";
import {ADD_MESSAGE} from "../constants/action-types";

const initialState = {
  articles: [],
  usersItems:[],
  items:[],
  messages:[],
  price:0,
  access_token:''
}; 
function rootReducer(state = initialState, action) {
  if(action.type === ACCESS_TOKEN){
    return Object.assign({}, state, {
      access_token: action.payload.access_token
    });
  } 
  if(action.type === USERS_ITEMS){
    return Object.assign({}, state, {
      usersItems: state.usersItems.concat(action.payload.usersItems)
    });
  }
  if(action.type === CHANGE_USER){
    return Object.assign({}, state, {
      usersItems: state.usersItems.map(todo => {
        if (todo.id !== action.id) {
          return todo
        }
      })
    })
  }
  if(action.type === DELETE_USER){
    return Object.assign({}, state, {
      usersItems: state.usersItems.filter(user => user.id !== action.payload.id).map(todo => {
        if (todo.id !== action.payload.id) {
          return todo
        }
      })
    });
  }
  if(action.type === ADD_MESSAGE){
    return Object.assign({}, state, {
      messages: state.messages.concat(action.payload.messages)
    });
  }
  return state;
};
  
export default rootReducer;
  