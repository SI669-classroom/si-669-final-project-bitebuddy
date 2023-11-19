const ADD_POST = 'ADD_POST';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const LOAD_POSTS = 'LOAD_POSTS';
const SAVE_PICTURE = 'SAVE_PICTURE';

const initPosts = [];

const initialState = {
  posts: initPosts,
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
    default:
      return state;
  }
}

export {
  rootReducer,
  ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS, SAVE_PICTURE
};