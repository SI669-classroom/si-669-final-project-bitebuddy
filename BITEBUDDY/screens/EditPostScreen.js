import React, { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { Input, Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { addPost, updatePost } from "../data/Actions";
import { diningHallOptions } from "../utils/dininghall";
import { Image } from 'react-native';


function EditPostScreen(props) {
  const { navigation, route } = props;
  const isAddingNewPost = !route.params?.post;

  const dispatch = useDispatch();

  const [inputTitle, setInputTitle] = useState(isAddingNewPost ? '' : route.params.post.title);
  const [inputDininghall, setInputDininghall] = useState(isAddingNewPost ? '' : route.params.post.diningHall);
  const [inputText, setInputText] = useState(isAddingNewPost ? '' : route.params.post.text);
  // const [inputTag, setInputTag] = useState(isAddingNewPost ? '' : route.params.post.tag);
  const [isTagActive, setIsTagActive] = useState(isAddingNewPost ? true : route.params.post.tag === 'active');
  const generateUniqueId = () => {
    return Date.now() + Math.random();
  };
  const [cameraRef, setCameraRef] = useState(null);
  const [inputImageURI, setInputImageURI] = useState(
    isAddingNewPost ? null : route.params.post.imageURI
  );

  

  const handleSavePost = async () => {
    const postKey = isAddingNewPost ? generateUniqueId() : route.params.post.key;
    const postDetails = {
      text: inputText,
      title: inputTitle,
      tag: isTagActive,
      diningHall: inputDininghall,
      key: postKey,
      imageURI: inputImageURI,
    };
    console.log('Dispatching Post Details:', postDetails);
    if (isAddingNewPost) {
      dispatch(addPost(postDetails));
    } else {
      dispatch(updatePost(postDetails));
    }
    navigation.goBack();
  };
  const handleImageUpdate = (imageURI) => {
    setInputImageURI(imageURI);
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

      <View style={styles.inputContainer}>
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
              color: "black",
              fontSize: 18,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderColor: 'gray',
              height: 35,
              width: '100%', 
            },
          }}
        />
      </View>



      {/* take picutre */}
      <View style={styles.imageContainer}>
          {inputImageURI ? (
            <Image source={{ uri: inputImageURI }} style={styles.image} />
          ) : (
            <Image source={require('../assets/ImageNotAvailable.png')} style={styles.image} />
          )}
          </View>
        <View style={styles.buttonContainer1}>
      <Button onPress={async () => {navigation.navigate('Camera',{onImageUpdate: handleImageUpdate,});}}>
        Take a picture
      </Button>
      </View>
   


      <View style={styles.tagContainer}>
        <TouchableOpacity
          style={[styles.tagLabel, { backgroundColor: isTagActive ? 'lightblue' : 'lightgray' }]}
          onPress={() => setIsTagActive(true)}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tagLabel, { backgroundColor: !isTagActive ? 'lightblue' : 'lightgray' }]}
          onPress={() => setIsTagActive(false)}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Inactive</Text>
        </TouchableOpacity>
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
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    width: '80%',
  },
  selectContainer:{
    flex: 0.1,
    paddingLeft:7,
    flexDirection: 'row',
    justifyContent: 'left',
    // alignItems: 'center',
    width: '80%',
  },
  tagLabel: {
    margin: 3,
    padding: 3,
    backgroundColor: 'lightgray',
    borderRadius: 6,
    borderWidth: 0
  },
  buttonContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%'
  },
  uploadButton: {
    fontSize: 18,
    color: 'blue',
    marginVertical: 10,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',},

  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%'
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  defaultImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default EditPostScreen;