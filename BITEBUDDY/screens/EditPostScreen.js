import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Input, Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { addPost, updatePost } from "../data/Actions";
import { v4 as uuidv4 } from 'uuid';
import { diningHallOptions } from "../utils/dininghall";

function EditPostScreen(props) {
  const { navigation, route } = props;
  const isAddingNewPost = !route.params?.post;

  const dispatch = useDispatch();

  const [inputTitle, setInputTitle] = useState(isAddingNewPost ? '' : route.params.post.title);
  const [inputDininghall, setInputDininghall] = useState(isAddingNewPost ? '' : route.params.post.diningHall);
  const [inputText, setInputText] = useState(isAddingNewPost ? '' : route.params.post.text);
  const [inputTag, setInputTag] = useState(isAddingNewPost ? '' : route.params.post.tag);

  const generateUniqueId = () => {
    return Date.now() + Math.random();
  };

  const handleSavePost = async () => {
    const postKey = isAddingNewPost ? generateUniqueId() : route.params.post.key;
    const postDetails = {
      text: inputText,
      title: inputTitle,
      tag: inputTag,
      diningHall: inputDininghall,
      key: postKey,
    };
    console.log('Dispatching Post Details:', postDetails);
    if (isAddingNewPost) {
      dispatch(addPost(postDetails));
    } else {
      dispatch(updatePost(postDetails));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isAddingNewPost ? 'Create Post' : 'Edit Post'}
        </Text>
      </View>
      <View style={styles.inputTitle}>
        <Input
          placeholder='Title'
          value={inputTitle}
          onChangeText={(text) => setInputTitle(text)}
          style={styles.inputStyle}
        />
      </View>



      <View style={styles.inputContainer}>
        <Input
          placeholder='Post detail'
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          style={styles.inputStyle}
        />
      </View>
      <View style={styles.selectContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Dining Hall", value: null }}
          items={diningHallOptions}
          onValueChange={(value) => setInputDininghall(value)}
          value={inputDininghall}
          style={{
            inputIOS: {
              color: "blue",
              fontSize: 20,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: 'gray',
              height: 40,
              width: '100%', // Make the width 100%
            },
          }}
        />
      </View>


      <View style={styles.inputContainer}>
        <Input
          placeholder='TAG'
          value={inputTag}
          onChangeText={(text) => setInputTag(text)}
          style={styles.inputStyle}
        />
      </View>


      <View style={styles.buttonContainer}>
        <Button
          title='Cancel'
          onPress={() => {
            navigation.goBack()
          }}
        />
        <Button
          title='Save'
          onPress={handleSavePost}
        />
      </View>
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '20%',
    paddingBottom: '5%',
    zIndex: 10,
    backgroundColor: 'lightblue',
  },
  headerButton: {
    position: 'absolute',
    left: 20,
    fontSize: 20,
  },
  headerText: {
    fontSize: 24,
    // position: 'absolute',
    width: '100%',
    textAlign: 'center'
  },
  body: {
    flex: 0.9
  },
  inputTitle: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  inputContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  tagContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  tagLabel: {
    margin: 3,
    padding: 3,
    backgroundColor: 'lightgray',
    borderRadius: 6,
    borderWidth: 0
  },
  buttonContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%'
  }
});

export default EditPostScreen;