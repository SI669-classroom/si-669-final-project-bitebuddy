import { firebaseConfig } from '../Secrets';
import { ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS, SAVE_PICTURE, LOAD_USERS, SET_USER, SET_CURRENT_CHAT } from "./Reducer";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';
import {
  addDoc, updateDoc, deleteDoc, onSnapshot, getDoc,
  getDocs, doc, collection, getFirestore, setDoc, serverTimestamp, query, where, orderBy
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

let usersSnapshotUnsub = undefined;
let chatSnapshotUnsub = undefined;

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


// const loadPosts = () => {
//   return async (dispatch) => {
//     let querySnapshot = await getDocs(collection(db, 'posts'));
//     let newPosts = querySnapshot.docs.map(docSnap => {
//       const data = docSnap.data();
//       return {
//         ...data,
//         key: docSnap.id,
//         lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : convertTimestamp(data.lastUpdated)?.toISOString()
//       }
//     });
//     console.log('loading posts:', newPosts);
//     dispatch({
//       type: LOAD_POSTS,
//       payload: {
//         newPosts: newPosts
//       }
//     });
//   }
// }

// Actions.js

const loadPosts = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'posts'));
    let newPosts = [];
    let updates = [];

    querySnapshot.forEach(docSnap => {
      let data = docSnap.data();
      let postData = {
        ...data,
        key: docSnap.id,
        lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : convertTimestamp(data.lastUpdated)?.toISOString()
      };

      // Check if the post is active and the activeUntil time has passed
      if (postData.isActive && postData.activeUntil && new Date(postData.activeUntil) < new Date()) {
        // Update the post to inactive
        updates.push(updateDoc(doc(db, 'posts', docSnap.id), { isActive: false }));
        postData.isActive = false;
      }

      newPosts.push(postData);
    });

    // Wait for all updates to complete
    await Promise.all(updates);

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
      lastUpdated: new Date().toISOString(),
      isActive: postDetails.isActive,
      activeUntil: postDetails.isActive ? postDetails.activeUntil : null,
      diningTime: postDetails.diningTime ? postDetails.diningTime : null,
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

// const updatePost = (postDetails) => {
//   return async (dispatch) => {
//     await updateDoc(doc(db, 'posts', postDetails.key), {
//       text: postDetails.text,
//       title: postDetails.title,
//       diningHall: postDetails.diningHall,
//       diningTime: postDetails.diningTime ? postDetails.diningTime : null,
//       imageURI: postDetails.imageURI,
//       lastUpdated: new Date().toISOString(),
//       isActive: postDetails.isActive,
//       activeUntil: postDetails.isActive ? postDetails.activeUntil : null,
//     });
//     console.log('Dispatching from Action:', postDetails);
//     dispatch({
//       type: UPDATE_POST,
//       payload: postDetails
//     });
//   };
// };
const updatePost = (postDetails) => {
  return async (dispatch, getState) => {
    try {
      const { key, ...rest } = postDetails;

      // console.log('Updating post in Firestore2:', postDetails);

      // Access the Firebase Storage URL from Redux state
      const pictureURI = getState().pictureURI;
      // console.log('Current pictureURI in Redux state11:', pictureURI);

      await updateDoc(doc(db, 'posts', key), {
        ...rest,
        lastUpdated: new Date().toISOString(),
        isActive: rest.isActive,
        activeUntil: rest.isActive ? rest.activeUntil : null,
        imageURI: pictureURI || null, // Include the imageURI in the update
      });
      // console.log('Current pictureURI in Redux state12:', pictureURI)
      // console.log('Post successfully updated in Firestore.');


      const action = {
        type: UPDATE_POST,
        payload: {
          ...rest,
          imageURI: pictureURI || null,
        },
      };

      console.log('Dispatching action:', action);
      // dispatch(action);
      console.log('UPDATE_POST action dispatched successfully.');
    } catch (error) {
      console.error('Error updating post:', error);
    }
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

// const savePicture = createAsyncThunk('SAVE_PICTURE', async (pictureData, { dispatch }) => {
//   try {
//     const pictureURI = pictureData?.uri;
//     dispatch({ type: 'SAVE_PICTURE', payload: pictureData });
//   } catch (error) {
//     console.error('Error saving picture:', error);
//   }
// });
const savePicture = createAsyncThunk('SAVE_PICTURE', async (pictureObject, { dispatch }) => {
  try {
    const fileName = pictureObject.uri.split('/').pop(); 
    // console.log('Uploading image:', fileName);

    const currentPhotoRef = ref(storage, `images/${fileName}`);
    const response = await fetch(pictureObject.uri);
    const imageBlob = await response.blob();
    await uploadBytes(currentPhotoRef, imageBlob);
    const pictureURI = await getDownloadURL(currentPhotoRef);
    
    // console.log('Upload successful. Picture URI:', pictureURI);
    
    dispatch({ type: 'SAVE_PICTURE', payload: { pictureObject, pictureURI } }); // Include pictureURI in the payload
    console.log('Dispatched SAVE_PICTURE action.',pictureURI)
    return pictureURI;
  } catch (error) {
    console.error('Error saving picture:', error);
    throw error;
  }
});


// add
const subscribeToUserUpdates = () => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
  }
  return (dispatch) => {
    usersSnapshotUnsub = onSnapshot(collection(db, 'users'), usersSnapshot => {
      const updatedUsers = usersSnapshot.docs.map(uSnap => {
        // console.log(uSnap.data());
        return uSnap.data(); // already has key?
      });
      dispatch({
        type: LOAD_USERS,
        payload: {
          users: updatedUsers
        }
      });
    });
  }
}

const addOrSelectChat = (user1id, user2id) => {
  // ... existing code ...
  return async (dispatch) => {
    try {
      // ... existing async code ...
      const chatQuery = query(collection(db, 'chats'),
        where('participants', 'array-contains', user1id),
      );
      const results = await getDocs(chatQuery);
      /*
        Ideally we would do this:
        const chatQuery = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user1id),
          where('participants', 'array-contains', user2id)
        );
        but Firestore doesn't allow more than one 'array-contains'
        where clauses in a single query. So instead we do the 
        second 'array-contains' clause "manually"
      );
      */
      chatSnap = results.docs?.find(
        elem => elem.data().participants.includes(user2id));
      // console.log('chatSnap', chatSnap);
      let theChat;
      // console.log('chatSnap66', chatSnap);
      if (!chatSnap) { //; we didn't find a match, create a new one
        theChat = {
          participants: [user1id, user2id],
        }
        const chatRef = await addDoc(collection(db, 'chats'), theChat);
        theChat.id = chatRef.id
      } else { // we did find a match, so let's use it.
        theChat = {
          ...chatSnap.data(),
          id: chatSnap.id
        }
      }
      // console.log('theChat', theChat);
      // const initialState = getState();
      // console.log('Initial State:', initialState);
      // console.log('Executing addOrSelectChat');
      dispatch({
        type: SET_CURRENT_CHAT, // Add this line
        payload: {
          currentChat: theChat
        },
      }); // initial dispatch


      if (chatSnapshotUnsub) {
        chatSnapshotUnsub();
        chatSnapshotUnsub = undefined;
      }

      const q = query(
        collection(db, 'chats', theChat.id, 'messages'),
        orderBy('timestamp', 'asc')
      );
      chatSnapshotUnsub = onSnapshot(
        q,
        (messagesSnapshot) => {
          const messages = messagesSnapshot.docs.map(msgSnap => {
            const message = msgSnap.data();
            return {
              ...message,
              timestamp: message.timestamp.seconds,
              id: msgSnap.id
            }
          });
          dispatch({
            type: SET_CURRENT_CHAT,
            payload: {
              currentChat: {
                ...theChat,
                messages: messages
              }
            }
          })
        }
      );
    } catch (error) {
      console.error("An error occurred: ", error);
      // Handle the error appropriately
    }
  }
}

const addCurrentChatMessage = (message) => {
  return async (dispatch, getState) => {
    // console.log('currentChat67', getState());
    const currentChat = getState().currentChat;
    const messageCollection = collection(db, 'chats', currentChat.id, 'messages');
    await addDoc(messageCollection, message); // no need to dispatch
  }
}

const unsubscribeFromUsers = () => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
    usersSnapshotUnsub = undefined;
  }
}

const unsubscribeFromChat = () => {
  if (chatSnapshotUnsub) {
    chatSnapshotUnsub();
    chatSnapshotUnsub = undefined;

  }
}

export {
  addUser,
  addPost,
  updatePost,
  deletePost,
  loadPosts,
  savePicture,  
  setUser,
  subscribeToUserOnSnapshot,
  loadUsers,
  //  add
  subscribeToUserUpdates,
  addOrSelectChat,
  addCurrentChatMessage,
  unsubscribeFromChat,
  unsubscribeFromUsers
}