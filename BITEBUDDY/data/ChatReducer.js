
const ADD_USER = 'ADD_USER';
const LOAD_USERS = 'LOAD_USERS';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';

const loadUsers = (state, payload) => {
  return {
    ...state, 
    users: [...payload.users]
  }
}

const addUser = (state, payload) => {
  return {
    ...state, 
    users: state.users.concat({...payload.user})
  }
}

const setCurrentUser = (state, payload) => {
  console.log('payload:',payload.currentUser);
  return {
    ...state, 
    currentUser: payload.currentUser
  }
}

const setCurrentChat = (state, payload) => {
  console.log('Current State:', state);
  console.log('Payload:', payload);
  return {
    ...state, 
    currentChat: payload.currentChat
  }
}

const initialState = {
  users: [],
  currentChat: { }
}

const rootReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
      return loadUsers(state, action.payload);
    case ADD_USER:
      return addUser(state, action.payload);
    case SET_CURRENT_USER:
      return setCurrentUser(state, action.payload);
    case SET_CURRENT_CHAT:
        return setCurrentChat(state, action.payload);
    default:
      return state;
  }
}

export { 
  rootReducer, 
  ADD_USER, 
  LOAD_USERS, 
  SET_CURRENT_USER, 
  SET_CURRENT_CHAT 
};