import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button } from "@rneui/base";
import { deletePost, loadPosts } from "../data/Actions";

function PostDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const postId = route.params.postId;
  const posts = useSelector((state) => state.posts);
  const post = posts.find(p => p.key === postId);
  console.log('post', post)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(loadPosts());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Post Detail</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditPost', { post })}>
          <Text style={styles.headerButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.text}>{post.text}</Text>
        <Text style={styles.diningHall}>{post.diningHall}</Text>
        <Text style={styles.tag}>{post.tag? "Active":"Inactive"}</Text>
      </View>
      <Button
        title='Delete'
        buttonStyle={{ backgroundColor: 'red' }}
        onPress={() => {
          dispatch(deletePost(post.key));
          navigation.popToTop();
        }
        }
      />
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
});

export default PostDetailScreen;