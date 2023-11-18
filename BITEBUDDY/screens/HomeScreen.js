import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Pressable } from "react-native";
import { Overlay, ButtonGroup } from "react-native-elements";
import { FontAwesome5 } from '@expo/vector-icons';

import { loadPosts } from "../data/Actions";

function HomeScreen(props) {
    const { navigation } = props;
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            dispatch(loadPosts());
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

    const RenderPost = React.memo(({ item }) => {
        if (!item) return null;
        return (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.key })}>
                <View style={styles.postCard}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postTag}>{item.tag ? 'Active' : 'Inactive'}</Text>
                    <Text style={styles.postDiningHall}>{item.diningHall}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Explore</Text>
                <TouchableOpacity onPress={handleAddPost}>
                    <FontAwesome5 name="plus-circle" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <RenderPost item={item} />}
                    keyExtractor={item => item.key}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    header: {
        flex: 0.1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: '10%',
        paddingTop: '25%',
        backgroundColor: 'lightblue'
    },
    headerText: {
        fontSize: 28,
        marginHorizontal: 10,
    },
    listContainer: {
        flex: 0.9,
        width: '100%',
        paddingTop: '10%',
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
})

export default HomeScreen;