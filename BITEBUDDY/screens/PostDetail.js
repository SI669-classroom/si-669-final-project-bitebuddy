import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { addItem, updateItem } from "../data/Actions";
import { v4 as uuidv4 } from 'uuid';

const diningHallOptions = [
  { label: "South Quad Dining Hall", value: "South Quad Dining Hall" },
  { label: "East Quad Dining Hall", value: "East Quad Dining Hall" },
  { label: "Mosher Jordan Dining Hall", value: "Mosher Jordan Dining Hall" },
  { label: "Bursley Dining Hall", value: "Bursley Dining Hall" },
  { label: "Markley Dining Hall", value: "Markley Dining Hall" },
  { label: "Couzens Dining Hall", value: "Couzens Dining Hall" },
  { label: "Stockwell Dining Hall", value: "Stockwell Dining Hall" },
  { label: "Twigs at Oxford Housing", value: "Twigs at Oxford Housing" },
];

function DetailsScreen(props) {

  const { navigation, route } = props;
  const { item } = route.params;

  const dispatch = useDispatch();
  const [inputTitle, setInputTitle] = useState(item.title);
  const [inputDininghall, setInputDininghall] = useState(item.diningHall);
  const [inputText, setInputText] = useState(item.text);
  const [inputTag, setInputTag] = useState(item.tag);
  // const [dropdownController, setDropdownController] = useState(null);

  useEffect(() => {
    console.log("Updated Item:", item);
  }, [item]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Edit Post
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
          onPress={()=>{
            navigation.navigate('Home');
          }}
        />
        <Button
          title='Save'
          onPress={()=>{
            if (item.key === -1) {
              console.log("add item11");
              console.log(inputText, inputTitle, inputTag, inputDininghall);
              // dispatch(addItem(inputText, inputTitle, inputTag, inputDininghall));
              dispatch(addItem(inputText, inputTitle, inputTag, inputDininghall, uuidv4()));
            } else {
              console.log("add item22");
              // console.log(item)
              console.log(inputText, inputTitle, inputTag, inputDininghall);
              if (item.key !== undefined && item.key !== null) {
                // console.log("Updating item:", item.key, inputText, inputTitle, inputTag, inputDininghall);
                dispatch(updateItem(item, inputText, inputTitle, inputTag, inputDininghall));
                console.log(item)
              }
            }
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%'
  }, 
  header: {
    flex: 0.1,
    justifyContent: 'flex-end',
    paddingBottom: '5%'
  },
  headerText: {
    fontSize: 32
  },
  inputTitle:{
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

export default DetailsScreen;