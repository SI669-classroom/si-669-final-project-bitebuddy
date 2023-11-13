
import { firebaseConfig } from '../Secrets';
import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, LOAD_ITEMS } from "./Reducer";

import { initializeApp } from 'firebase/app';
import { addDoc, updateDoc, deleteDoc,
  getDocs, doc, collection, getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadItems = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'todos'));
    let newListItems = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        key: docSnap.id
      }
    });
    console.log('loading items:', newListItems);
    dispatch({
      type: LOAD_ITEMS,
      payload: {
        newListItems: newListItems
      }
    });
  }
}

const addItem = (newText,newTitle,newTag,newDiningHall) => {
  return async (dispatch) => {
    const docRef = await addDoc(collection(db, 'todos'), { text: newText, title:newTitle, tag: newTag, diningHall: newDiningHall });
    const id = docRef.id;
    dispatch({
      type: ADD_ITEM,
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

const updateItem = (item, newText,newTitle,newTag,newDiningHall) => {
  return async (dispatch) => {
    await updateDoc(doc(db, 'todos', item.key), { text: newText, title:newTitle, tag: newTag, diningHall: newDiningHall});
    dispatch({
      type: UPDATE_ITEM,
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


const deleteItem = (item) => {
  return async (dispatch) => {
    await deleteDoc(doc(db, 'todos', item.key));
    dispatch({
      type: DELETE_ITEM,
      payload: {
        key: item.key
      }
    })
  };
}

export {
  addItem, updateItem, deleteItem, loadItems
}