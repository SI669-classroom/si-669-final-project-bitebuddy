import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ username }) => {
    const firstLetter = username ? username.charAt(0).toUpperCase() : '?';

    return (
        <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        width: 24,
        height: 24,
        borderRadius: 20,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Avatar;
