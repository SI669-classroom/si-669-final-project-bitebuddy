import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button } from "@rneui/base";

import ListItem from "../components/ListItem";
import { loadItems } from "../data/Actions";
function HomeScreen(props) {
  
  const { navigation } = props;
  const listItems = useSelector((state) => state.listItems);

  const dispatch = useDispatch();

  useEffect(()=>{
    console.log('dispatching load');
    dispatch(loadItems());
  }, []);

  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Homepage</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={listItems}
          renderItem={({item})=>{
            return (
              // console.log("here:",item),
              <ListItem item={item} navigation={navigation} />
            );
          }}
        />
      </View>
      <Button
        title='Add'
        onPress={()=>{
          // console.log(item),
          navigation.navigate('Details', {
            item: {
              key: -1,
              title: '',
              text: '',
              diningHall: '',
              tag: '',
            }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '10%',
//    paddingBottom: '5%',
    paddingTop: '25%'
  },
  headerText: {
    fontSize: 32
  },
  listContainer: {
    flex: 0.6,
    width: '100%',
    paddingLeft: '10%',
    paddingTop: '10%'
  },
  menuContainer: {
    padding: '5%'
  },
  menuText: {
    fontSize: 32
  }
});

export default HomeScreen;