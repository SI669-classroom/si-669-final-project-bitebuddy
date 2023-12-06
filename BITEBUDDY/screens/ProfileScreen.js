import { View, Text, Alert, StyleSheet, Image } from 'react-native';
import { signOut, getAuthUser } from "../data/DB";
import { Button } from '@rneui/themed';
import logo from '../assets/logo.png';

function ProfileScreen() {

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerText}>My Profile</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.bodyText}>
                    Welcome to BiteBuddy, {getAuthUser().displayName}!
                </Text>
                <Image source={logo} style={styles.image} />
                <Button
                    onPress={async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            Alert.alert("Sign Out Error", error.message, [{ text: "OK" }])
                        }
                    }}
                >
                    Sign Out
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    body: {
        flex: 0.8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
    },
    bodyText: {
        fontSize: 22,
        marginVertical: 10,
    },
    image: {
        marginVertical: 20,
        width: 210,
        height: 200
    },
    signOutButton: {
        marginBottom: 20,
    },
})

export default ProfileScreen;