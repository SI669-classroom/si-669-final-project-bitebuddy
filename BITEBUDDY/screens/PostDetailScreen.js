import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "@rneui/base";
import { deletePost, loadPosts, subscribeToUserOnSnapshot } from "../data/Actions";
import { subscribeToUserUpdates, addOrSelectChat, unsubscribeFromUsers } from '../data/Actions';
import { getAuthUser, signOut } from '../data/DB';
import Avatar from "../components/Avatar";
import { format } from 'date-fns';

function PostDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const postId = route.params.postId;
  const posts = useSelector((state) => state.posts);
  const post = posts.find(p => p.key === postId);
  const currentAuthUser = getAuthUser();
  console.log('post', post)
  const users = useSelector(state => state.users);
  const isAuthor = post.userId === currentAuthUser.uid;
  const user = users.find(u => u.key === post.userId);
  console.log('isAuthor?', isAuthor);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(loadPosts());
      dispatch(subscribeToUserUpdates());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'MM-dd-yyyy hh:mm a');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Post Detail</Text>
        {isAuthor && (
          <TouchableOpacity onPress={() => navigation.navigate('EditPost', { post })}>
            <Text style={styles.headerButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.body}>
        <Avatar username={user?.displayName} />
        <Text style={styles.userName}>{user?.displayName}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.text}>{post.text}</Text>
        <Text style={styles.diningHall}>{post.diningHall}</Text>
        <Text style={styles.diningTime}>Dining Time: {formatDateTime(post.diningTime)}</Text>
        <Text style={styles.tag}>{post.isActive ? "Active" : "Inactive"}</Text>
        {post.isActive && <Text style={styles.activeUntil}>Active Until: {formatDateTime(post.activeUntil)}</Text>}
        {post.imageURI ? <Image source={{ uri: post.imageURI }} style={styles.postImage} /> : null}
      </View>

      {isAuthor && (
        <Button
          title='Delete'
          style={styles.button}
          buttonStyle={{ backgroundColor: 'red' }}
          onPress={() => {
            dispatch(deletePost(post.key));
            navigation.popToTop();
          }}
        />
      )}

      {!isAuthor && (
        <Button
          title="Contact me!"
          onPress={() => {
            dispatch(addOrSelectChat(currentAuthUser.uid, post.userId));
            navigation.navigate('ChatMain', {
              currentUserId: currentAuthUser.uid,
              otherUserId: post.userId
            });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flex: 0.1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '10%',
    paddingTop: '25%',
    backgroundColor: 'lightblue'
  },
  headerButton: {
    fontSize: 16
  },
  headerText: {
    fontSize: 24
  },
  body: {
    flex: 0.6,
    width: '100%',
    paddingLeft: '10%',
    paddingTop: '10%'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  diningHall: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'darkblue',
    marginBottom: 5,
  },
  tag: {
    fontSize: 14,
    backgroundColor: 'lightgray',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  postImage: {
    width: '90%', // or specify a fixed width
    height: '90%',   // or specify a fixed height
    resizeMode: 'cover', // or 'contain' based on your preference
    borderRadius: 10,
  },
  button: {
    paddingTop: 200,
  },
});

export default PostDetailScreen;