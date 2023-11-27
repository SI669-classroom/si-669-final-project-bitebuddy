import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addOrSelectChat, subscribeToUserUpdates } from '../data/Actions';
import { setDoc, addDoc, doc, getFirestore,
  getDocs, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase'; // assuming you have your Firebase initialization in a separate file
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Secrets';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ChatDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  console.log("currentUser??", currentUser)
  const users = useSelector((state) => state.users);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dispatch(subscribeToUserUpdates());

      // Assuming fetchChats is an asynchronous function that fetches chats from Firebase
      const fetchedChats = await fetchChats();
      setChats(fetchedChats);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const fetchChats = async () => {
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);
    // console.log("fetching chats")
    try {
      const chatQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', currentUser.key)  // Use currentUser.key directly
      );
      
      const results = await getDocs(chatQuery);
      const chats = results.docs.map((chatSnap) => {
        return {
          ...chatSnap.data(),
          id: chatSnap.id,
        };
      });
      console.log("fetchedchats???", chats)
      return chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const filteredUsers = users.filter((user) =>
  chats.some(
    (chat) =>
      (chat.participants.includes(currentUser.key) && chat.participants.includes(user.key))
  )
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatDetail Screen</Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
              dispatch(addOrSelectChat(currentUser.key, item.key));
              console.log("dispatch success!!")
              navigation.navigate('Chat', {
                currentUserId: currentUser.key,
                otherUserId: item.key,
              });
            }}
          >
            <Text>{`Chat with ${item.displayName}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});

export default ChatDetailScreen;
