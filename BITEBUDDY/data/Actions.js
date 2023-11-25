import { firebaseConfig } from '../Secrets';
import { ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS, SAVE_PICTURE, LOAD_USERS, SET_USER } from "./Reducer";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';
import {
  addDoc, updateDoc, deleteDoc, onSnapshot, getDoc,
  getDocs, doc, collection, getFirestore, setDoc, serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const convertTimestamp = (timestamp) => {
  return timestamp ? new Date(timestamp.seconds * 1000) : null;
};

const addUser = (authUser) => {
  return async (dispatch) => {
    userToAdd = {
      displayName: authUser.displayName,
      email: authUser.email,
      key: authUser.uid
    };
    await setDoc(doc(db, 'users', authUser.uid), userToAdd);
  }
}

const setUser = (authUser) => {
  return async (dispatch) => {
    if (!authUser || !authUser.uid) {
      console.error("AuthUser is undefined or does not have a uid");
      return; // Exit the function if authUser is not valid
    }
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const user = userSnap.data();
        dispatch({
          type: SET_USER,
          payload: {
            user: user
          }
        });
      } else {
        console.log('No user data found in Firestore for:', authUser.uid);
        // Handle user not found
      }
    } catch (error) {
      console.error("Error setting user:", error);
      // Handle the error appropriately
    }
  }
}

const loadUsers = () => {
  return async (dispatch) => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        key: docSnap.id
      };
    });
    dispatch({
      type: LOAD_USERS,
      payload: {
        users: users
      }
    });
  }
};

const subscribeToUserOnSnapshot = (userId) => {
  console.log('subscribe to user', userId);
  return dispatch => {
    onSnapshot(doc(db, 'users', userId), (userSnapshot) => {
      const updatedUser = {
        ...userSnapshot.data(),
        key: userSnapshot.id
      };
      dispatch({
        type: SET_USER,
        payload: {
          user: updatedUser
        }
      });
    });
  }
}


const loadPosts = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'posts'));
    let newPosts = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        ...data,
        key: docSnap.id,
        lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : convertTimestamp(data.lastUpdated)?.toISOString()
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

const loadUserPosts = (userId) => {
  return async (dispatch) => {
    if (!userId) {
      console.error("No user ID provided to load posts");
      return;
    }

    const querySnapshot = await getDocs(query(collection(db, 'posts'), where("userId", "==", userId)));
    let userPosts = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        key: docSnap.id
      };
    });

    dispatch({
      type: LOAD_POSTS,
      payload: {
        newPosts: userPosts
      }
    });
  }
}

const addPost = (postDetails, userId) => {
  return async (dispatch) => {
    if (!userId) {
      console.error("No user ID provided for the post");
      return;
    }
    const newPostDetails = {
      ...postDetails,
      userId,
      lastUpdated: new Date().toISOString()
    };

    postDetails.userId = userId;

    const docRef = await addDoc(collection(db, 'posts'), newPostDetails);

    dispatch({
      type: ADD_POST,
      payload: {
        ...newPostDetails,
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
      diningHall: postDetails.diningHall,
      imageURI: postDetails.imageURI,
      lastUpdated: new Date().toISOString()
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

const savePicture = createAsyncThunk('SAVE_PICTURE', async (pictureData, { dispatch }) => {
  try {
    const pictureURI = pictureData?.uri;
    dispatch({ type: 'SAVE_PICTURE', payload: pictureData });
  } catch (error) {
    console.error('Error saving picture:', error);
  }
});

export {
  addUser, addPost, updatePost, deletePost, loadPosts, savePicture, setUser, subscribeToUserOnSnapshot, loadUsers
}