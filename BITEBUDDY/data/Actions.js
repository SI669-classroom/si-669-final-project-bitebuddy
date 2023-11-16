import { firebaseConfig } from '../Secrets';
import { ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS } from "./Reducer";

import { initializeApp } from 'firebase/app';
import {
  addDoc, updateDoc, deleteDoc,
  getDocs, doc, collection, getFirestore
} from 'firebase/firestore';

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

const addPost = (postDetails) => {
  return async (dispatch) => {
    const docRef = await addDoc(collection(db, 'posts'), postDetails);
    dispatch({
      type: ADD_POST,
      payload: {
        ...postDetails,
        key: docRef.id
      }
    })
  }
}

const updatePost = (postDetails) => {
  return async (dispatch) => {
    await updateDoc(doc(db, 'posts', postDetails.key), {
      text: postDetails.text,
      title: postDetails.title,
      tag: postDetails.tag,
      diningHall: postDetails.diningHall
    });
    console.log('Dispatching from Action:', postDetails);
    dispatch({
      type: UPDATE_POST,
      payload: postDetails
    });
  };
};


const deletePost = (postId) => {
  return async (dispatch) => {
    await deleteDoc(doc(db, 'posts', postId));
    dispatch({
      type: DELETE_POST,
      payload: {
        key: postId
      }
    });
    dispatch(loadPosts())
  }
}

export {
  addPost, updatePost, deletePost, loadPosts
}