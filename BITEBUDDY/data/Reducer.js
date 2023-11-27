const ADD_POST = 'ADD_POST';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const LOAD_POSTS = 'LOAD_POSTS';
const SAVE_PICTURE = 'SAVE_PICTURE';
const LOAD_USERS = 'LOAD_USERS';
const SET_USER = 'SET_USER';

const ADD_USER = 'ADD_USER';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';

const initialState = {
  posts: [],
  users: [],
  messages: [],
  currentChat: { }
}

const loadUsers = (state, action) => {
  const { users } = action.payload;
  return {
    ...state,
    users: users
  }
}

const setUser = (state, action) => {
  if (action.payload && action.payload.user) {
    return {
      ...state,
      currentUser: action.payload.user
    }
  } else {
    return {
      ...state,
      currentUser: null // or keep the existing state.currentUser if that's your intended logic
    }
  }
}

const loadPosts = (state, posts) => {
  return {
    ...state,
    posts: [...posts]
  }
}

const addPost = (state, action) => {
  let newPost = action.payload;
  let newPosts = state.posts.concat(newPost);
  return {
    ...state,
    posts: newPosts
  }
}

const updatePost = (state, action) => {
  let { key } = action.payload;
  const updatedPosts = state.posts.map(post =>
    post.key === key ? { ...post, ...action.payload } : post
  );
  return {
    ...state,
    posts: updatedPosts,
  };
};

const deletePost = (state, postId) => {
  let { posts } = state;
  let newPosts = posts.filter(elem => elem.key !== postId);
  return {
    ...state,
    posts: newPosts
  }
}

const savePicture = (state, action) => {
  return {
    ...state,
    updatedPictureURI: action.payload.uri,
  };
};

const addUser = (state, payload) => {
  return {
    ...state, 
    users: state.users.concat({...payload.user})
  }
}

const setCurrentUser = (state, payload) => {
  console.log('payload:',payload.currentUser.messages);
  return {
    ...state, 
    currentUser: payload.currentUser
  }
}

const setCurrentChat = (state, payload) => {
  // console.log('Current State:', state);
  // console.log('Payload:', payload);
  return {
    ...state, 
    currentChat: payload.currentChat
  }
}


function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return addPost(state, action);
    case UPDATE_POST:
      return updatePost(state, action);
    case DELETE_POST:
      return deletePost(state, action.payload);
    case LOAD_POSTS:
      return loadPosts(state, action.payload.newPosts);
    case SAVE_PICTURE:
      return savePicture(state, action);
    case LOAD_USERS:
      return loadUsers(state, action);
    case SET_USER:
      return setUser(state, action);
    // new add
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
  ADD_POST, 
  UPDATE_POST, 
  DELETE_POST, 
  LOAD_POSTS, 
  SAVE_PICTURE, 
  LOAD_USERS, 
  SET_USER,

  ADD_USER,
  SET_CURRENT_USER, 
  SET_CURRENT_CHAT 
};