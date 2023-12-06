import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addOrSelectChat, subscribeToUserUpdates } from '../data/Actions';
import {
  setDoc, addDoc, doc, getFirestore,
  getDocs, collection, query, where, orderBy, onSnapshot
} from 'firebase/firestore';
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
    user.key !== currentUser.key &&
    chats.some(
      (chat) =>
        (chat.participants.includes(currentUser.key) && chat.participants.includes(user.key))
    )
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
      </View>
      {/* <Text style={styles.title}>ChatDetail Screen</Text> */}
      <View style={styles.chatlist}>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => {
                dispatch(addOrSelectChat(currentUser.key, item.key));
                console.log("dispatch success!!")
                navigation.navigate('ChatMain', {
                  currentUserId: currentUser.key,
                  otherUserId: item.key,
                });
              }}
            >
              <Text style={styles.listText}>{`Chat with ${item.displayName}`}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    width: '100%',
    padding: 16,
    marginBottom: 4,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  headerContainer: {
    // flex: 0.1,
    width: '100%',
    // flexDirection: 'row',
    // justifyContent: "space-between",
    // alignItems: 'center',
    paddingHorizontal: '10%',
    paddingTop: '25%',
    paddingBottom: '5%',
    backgroundColor: 'lightblue'
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    // paddingHorizontal: '10%',
  },
  headerText: {
    fontSize: 28,
    marginHorizontal: 10,
  },
  chatlist: {
    marginVertical: 20,
    paddingHorizontal: 16
  },
  listText: {
    fontSize: 16
  }
});

export default ChatDetailScreen;
