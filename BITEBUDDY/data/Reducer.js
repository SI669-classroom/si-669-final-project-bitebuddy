const ADD_POST = 'ADD_POST';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const LOAD_POSTS = 'LOAD_POSTS';

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

const addPost = (state, text, title, tag, key, diningHall) => {
  let { posts } = state;
  let newPosts = posts.concat({
    text: text,
    title: title,
    tag: tag,
    diningHall: diningHall,
    key: key,
  });
  return {
    ...state,
    posts: newPosts,
  };
};

const updatePost = (state, postId, newText, newTitle, newTag, newDiningHall) => {
  let { posts } = state;
  let newPost = {
    text: newText,
    title: newTitle,
    tag: newTag,
    diningHall: newDiningHall,
    key: postId,
  };
  let newPosts = posts.map((elem) => (elem.key === postId ? newPost : elem));
  return {
    ...state,
    posts: newPosts,
  };
};

const deletePost = (state, postId) => {
  let { posts } = state;
  let newPosts = posts.filter(elem=>elem.key !== postId);
  return {
    ...state, 
    posts: newPosts
  }
}

function rootReducer(state=initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_POST:
      return addPost(state, payload.text, payload.title, payload.tag, payload.key, payload.diningHall);
    case UPDATE_POST:
      return updatePost(state, payload.key, payload.text, payload.title, payload.tag, payload.diningHall);
    case DELETE_POST:
      return deletePost(state, payload.key);
    case LOAD_POSTS:
      return loadPosts(state, payload.newPosts);
    default:
      return state;
  }
}

export { 
  rootReducer, 
  ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS
};