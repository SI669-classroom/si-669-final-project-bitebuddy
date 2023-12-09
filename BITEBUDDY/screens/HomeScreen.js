import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Pressable, ScrollView } from "react-native";
import { Overlay, ButtonGroup } from "react-native-elements";
import { Input, Button } from "@rneui/themed";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { loadPosts, loadUsers } from "../data/Actions";
import RNPickerSelect from "react-native-picker-select";
import { diningHallOptions } from "../utils/dininghall";
import Avatar from "../components/Avatar";
import { format } from 'date-fns';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function HomeScreen(props) {
    const { navigation } = props;
    const posts = useSelector((state) => state.posts);
    const users = useSelector((state) => state.users);

    const dispatch = useDispatch();
    const [initialLoad, setInitialLoad] = useState(true);
    const [filterDiningHall, setFilterDiningHall] = useState('');

    const [postStatusFilter, setPostStatusFilter] = useState('active'); // 'active' or 'all'
    const [diningTimeStart, setDiningTimeStart] = useState(null);
    const [diningTimeEnd, setDiningTimeEnd] = useState(null);
    const [isDiningTimePickerVisible, setDiningTimePickerVisible] = useState({ start: false, end: false });

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);


    const resetFilters = () => {
        setFilterDiningHall('');
        setPostStatusFilter('active'); // Assuming 'active' is the default
        setDiningTimeStart(null);
        setDiningTimeEnd(null);
    };

    const formatDateTime = (date) => {
        return format(date, 'MM-dd-yyyy hh:mm a'); // Example format: 'Jun 23, 2020, 7:30 PM'
    };

    const showDiningTimePicker = (type) => {
        setDiningTimePickerVisible({ ...isDiningTimePickerVisible, [type]: true });
    };

    const hideDiningTimePicker = (type) => {
        setDiningTimePickerVisible({ ...isDiningTimePickerVisible, [type]: false });
    };

    const handleDiningTimeConfirm = (date, type) => {
        if (type === 'start') {
            setDiningTimeStart(date);
        } else {
            setDiningTimeEnd(date);
        }
        hideDiningTimePicker(type);
    };


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

    const statusFilteredPosts = posts.filter(post => {
        if (postStatusFilter === 'active') {
            return post.isActive;
        }
        return true; // If filter is set to 'all', return all posts
    });

    const timeFilteredPosts = statusFilteredPosts.filter(post => {
        const postTime = new Date(post.diningTime).getTime();
        const isAfterStart = diningTimeStart ? postTime >= diningTimeStart.getTime() : true;
        const isBeforeEnd = diningTimeEnd ? postTime <= diningTimeEnd.getTime() : true;
        return isAfterStart && isBeforeEnd;
    });

    // filter dinning hall
    // const filteredPosts = filterDiningHall
    //     ? posts.filter(post => post.diningHall.toLowerCase().includes(filterDiningHall.toLowerCase()))
    //     : posts;

    const finalFilteredPosts = timeFilteredPosts.filter(post => {
        return filterDiningHall
            ? post.diningHall.toLowerCase().includes(filterDiningHall.toLowerCase())
            : true;
    });

    const sortedPosts = finalFilteredPosts.sort((a, b) => {
        const dateA = new Date(a.lastUpdated);
        const dateB = new Date(b.lastUpdated);
        return dateB - dateA;
    });

    const RenderPost = React.memo(({ item }) => {
        const user = users.find((user) => user.key === item.userId);
        if (!item) return null;
        const formattedDate = item.lastUpdated ? formatDate(item.lastUpdated) : 'Unknown';
        const formattedDiningTime = item.diningTime ? format(new Date(item.diningTime), 'MM-dd-yyyy hh:mm a') : 'Not specified';

        return (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.key })}>
                <View style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <Avatar username={user?.displayName} />
                        {/* <FontAwesome5 name="user-circle" size={24} color="black" /> */}
                        <Text style={styles.userName}>{user?.displayName || 'Unknown User'}</Text>
                    </View>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postTag}>{item.isActive ? 'Active' : 'Inactive'}</Text>
                    <Text style={styles.postDiningHall}>{item.diningHall}</Text>
                    <Text style={styles.diningTimeText}>
                        Dining Time: {formattedDiningTime}
                    </Text>
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
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerText}>Explore</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => setIsFilterModalVisible(true)}>
                            <FontAwesome5 name="filter" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.headerBtn} onPress={handleAddPost}>
                            <FontAwesome5 name="plus-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Overlay isVisible={isFilterModalVisible} onBackdropPress={() => setIsFilterModalVisible(false)}>
                <View style={styles.filterModalContent}>
                    <View style={styles.selectContainer}>
                        <RNPickerSelect
                            placeholder={{ label: "Select Dining Hall", value: null }}
                            items={diningHallOptions}
                            onValueChange={(value) => setFilterDiningHall(value)}
                            value={filterDiningHall}
                            style={pickerSelectStyles}
                        />
                        <RNPickerSelect
                            placeholder={{ label: "Select Post Status", value: null }}
                            items={[
                                { label: 'Show Active Posts', value: 'active' },
                                { label: 'Show All Posts', value: 'all' }
                            ]}
                            onValueChange={(value) => setPostStatusFilter(value)}
                            value={postStatusFilter}
                            style={pickerSelectStyles}
                        />
                        <Button title="Select Dining Start Time" type="clear" onPress={() => showDiningTimePicker('start')} />
                        {diningTimeStart && <Text>Start Time: {formatDateTime(diningTimeStart)}</Text>}

                        <Button title="Select Dining End Time" type="clear" onPress={() => showDiningTimePicker('end')} />
                        {diningTimeEnd && <Text>End Time: {formatDateTime(diningTimeEnd)}</Text>}

                        <DateTimePickerModal
                            isVisible={isDiningTimePickerVisible.start}
                            mode="datetime"
                            onConfirm={(date) => handleDiningTimeConfirm(date, 'start')}
                            onCancel={() => hideDiningTimePicker('start')}
                        />
                        <DateTimePickerModal
                            isVisible={isDiningTimePickerVisible.end}
                            mode="datetime"
                            onConfirm={(date) => handleDiningTimeConfirm(date, 'end')}
                            onCancel={() => hideDiningTimePicker('end')}
                        />
                    </View>
                    <View style={styles.filterModalFooter}>
                        <Button title="Reset" type="outline" onPress={resetFilters} />
                        <Button title="Save" onPress={() => setIsFilterModalVisible(false)} />
                    </View>
                </View>
            </Overlay>

            <ScrollView style={styles.listContainer}>
                {sortedPosts.map((item, index) => (
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
        paddingBottom: '5%',
        backgroundColor: 'lightblue'
    },
    header: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        // paddingHorizontal: '10%',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
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
        width: '100%', // Adjusted width to take up the entire width
        height: 200,   // Set a fixed or dynamic height as needed
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10, 
    },
    lastUpdatedText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'right',
        marginTop: 10,
    },
    headerBtn: {
        marginRight: 5,
    }
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
    filterModalContent: {
        padding: 20,
    },
    filterModalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
});

export default HomeScreen;