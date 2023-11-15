import { firebaseConfig } from '../Secrets';
import { ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS } from "./Reducer";

import { initializeApp } from 'firebase/app';
import { addDoc, updateDoc, deleteDoc,
  getDocs, doc, collection, getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadPosts = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'posts'));
    let newPosts = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        key: docSnap.id
      }
    });
    console.log('loading posts:', newPosts);
    dispatch({
      type: LOAD_POSTS,
      payload: {
        newPosts: newPosts
      }
    });
  }
}

const addPost = (newText, newTitle, newTag, newDiningHall) => {
  return async (dispatch) => {
    const docRef = await addDoc(collection(db, 'posts'), { text: newText, title: newTitle, tag: newTag, diningHall: newDiningHall });
    const id = docRef.id;
    dispatch({
      type: ADD_POST,
      payload: {
        text: newText,
        title: newTitle,
        tag: newTag,
        diningHall: newDiningHall,
        key: id,
      }
    });
  }
}

const updatePost = (post, newText, newTitle, newTag, newDiningHall) => {
  return async (dispatch) => {
    await updateDoc(doc(db, 'posts', post.key), { text: newText, title: newTitle, tag: newTag, diningHall: newDiningHall});
    dispatch({
      type: UPDATE_POST,
      payload: {
        text: newText,
        title: newTitle,
        tag: newTag,
        diningHall: newDiningHall,
        key: item.key,
      }
    });
  };
};


const deletePost = (post) => {
  return async (dispatch) => {
    await deleteDoc(doc(db, 'posts', post.key));
    dispatch({
      type: DELETE_POST,
      payload: {
        key: post.key
      }
    })
  };
}

export {
  addPost, updatePost, deletePost, loadPosts
}