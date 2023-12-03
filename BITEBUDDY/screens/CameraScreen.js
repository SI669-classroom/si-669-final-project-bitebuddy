import { Button } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { savePicture } from '../data/Actions';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { updatePost } from '../data/Actions';
import { createAsyncThunk, getState } from '@reduxjs/toolkit';
function CameraScreen({navigation}) {
  
//   const currentUser = useSelector(state => state.currentUser);
const route = useRoute();
const dispatch = useDispatch();
const pictureURI = useSelector((state) => state.pictureURI);
const [localPictureURI, setLocalPictureURI] = useState(null);

  const [hasPermission, setHasPermission] = useState(null);
  const { onImageUpdate } = route.params || {};

  async function getPermissions(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log('status', status);
    setHasPermission(status === 'granted');
  }
  useEffect(()=>{
    getPermissions();
  }, []);

  useEffect(() => {
    // Update local state when pictureURI changes
    setLocalPictureURI(pictureURI);
  }, [pictureURI]); // Run whenever pictureURI changes


  let theCamera = undefined;

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <Button
          type='clear'
          size='sm'
          onPress={async () => {
            navigation.goBack();
          }}
        >
          {'< Back Home'}
        </Button>
      </View>
      <Text style={{padding:'5%'}}>
        Hi! Time to take a picture!
      </Text>
      <View style={styles.cameraContainer}>
        {hasPermission ? 
          <Camera 
            style={styles.camera}
            ratio='4:3'
            pictureSize='Medium'
            type={CameraType.back}
            ref={ref => theCamera = ref}
          />
        :
          <Text>Can't access camera--check permissions?</Text>
        }
      </View>
      
      <Button
        onPress={async () => {
          try {
            let pictureObject = await theCamera.takePictureAsync({ quality: 0.1 });
            const pictureURI = await dispatch(savePicture(pictureObject)); // Wait for savePicture to complete
          
            const updatedPost = {
              ...route.params.post,
              imageURI: pictureURI || pictureObject.uri, // Use pictureURI if available, otherwise fallback to pictureObject.uri
            };
            console.log('updatedPost??', updatedPost);
          
            await dispatch(updatePost(updatedPost)); // Wait for updatePost to complete
            navigation.goBack();
          } catch (error) {
            console.error('Error in onPress:', error);
          }
        }}
>
  Snap!
</Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHeader: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    padding: '5%',
    //backgroundColor: 'green'
  },
  listContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },

cameraContainer: {
  flex: 0.8,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
},
  camera: {
    flex: 0.85,
    height: '100%',
    width: '100%',
  },
});

export default CameraScreen;