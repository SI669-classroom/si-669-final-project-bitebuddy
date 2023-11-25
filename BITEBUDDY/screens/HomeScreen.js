import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Pressable, ScrollView } from "react-native";
import { Overlay, ButtonGroup } from "react-native-elements";
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'react-native';
import { loadPosts, loadUsers } from "../data/Actions";
import RNPickerSelect from "react-native-picker-select";
import { diningHallOptions } from "../utils/dininghall";

function HomeScreen(props) {
    const { navigation } = props;
    const posts = useSelector((state) => state.posts);
    const users = useSelector((state) => state.users);

    const dispatch = useDispatch();
    const [initialLoad, setInitialLoad] = useState(true);
    const [filterDiningHall, setFilterDiningHall] = useState('');

    useEffect(() => {
        if (initialLoad) {
            dispatch(loadPosts());
            dispatch(loadUsers());
            setInitialLoad(false);
        }
        const unsubscribe = navigation.addListener('focus', () => {
        });
        return unsubscribe;
    }, [navigation, dispatch, initialLoad]);
    console.log('#####', posts.length)

    const handleAddPost = () => {
        navigation.navigate('EditPost');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // filter dinning hall
    const filteredPosts = filterDiningHall
        ? posts.filter(post => post.diningHall.toLowerCase().includes(filterDiningHall.toLowerCase()))
        : posts;

    const RenderPost = React.memo(({ item }) => {
        const user = users.find((user) => user.key === item.userId);
        if (!item) return null;
        const formattedDate = item.lastUpdated ? formatDate(item.lastUpdated) : 'Unknown';

        return (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.key })}>
                <View style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <FontAwesome5 name="user-circle" size={24} color="black" />
                        <Text style={styles.userName}>{user?.displayName || 'Unknown User'}</Text>
                    </View>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postTag}>{item.tag ? 'Active' : 'Inactive'}</Text>
                    <Text style={styles.postDiningHall}>{item.diningHall}</Text>
                    {item.imageURI ? (
                        <Image source={{ uri: item.imageURI }} style={styles.postImage} />
                    ) : null}
                    <Text style={styles.lastUpdatedText}>
                        Last Updated at: {formattedDate}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    })



    return (
        <View style={styles.screen}>

            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Explore</Text>
                    <TouchableOpacity onPress={handleAddPost}>
                        <FontAwesome5 name="plus-circle" size={24} color="black" />
                    </TouchableOpacity>

                </View>
                <View style={styles.selectContainer}>
                    <RNPickerSelect
                        placeholder={{ label: "Select Dining Hall", value: null }}
                        items={diningHallOptions}
                        onValueChange={(value) => setFilterDiningHall(value)}
                        value={filterDiningHall}
                        style={pickerSelectStyles}
                    />
                </View>
            </View>

            <ScrollView style={styles.listContainer}>
                {filteredPosts.map((item, index) => (
                    <RenderPost key={index} item={item} />
                ))}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    headerContainer: {
        // flex: 0.1,
        width: '100%',
        // flexDirection: 'row',
        // justifyContent: "space-between",
        // alignItems: 'center',
        paddingHorizontal: '10%',
        paddingTop: '25%',
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
    selectContainer: {
        paddingHorizontal: '10%',
        paddingBottom: 10,
    },
    listContainer: {
        flexGrow: 1,
        width: '100%',
        // paddingTop: '10%',
        // alignItems: 'center'
    },
    postCard: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 24,
        // alignSelf: 'stretch',
        borderRadius: 10,
        shadowColor: "#000",
        // width: '90%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    userName: {
        marginLeft: 10,
        fontSize: 20
    },
    postTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    postTag: {
        fontSize: 16,
        paddingVertical: 10,
        color: 'blue',
    },
    postDiningHall: {
        fontSize: 14,
        color: 'gray',
    },
    postImage: {
        width: '60%',
        height: '60%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    lastUpdatedText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'right',
        marginTop: 10,
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: "black",
        fontSize: 18,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: 'gray',
        height: 35,
        width: '100%',
    },
    // Add Android styles if needed
});

export default HomeScreen;