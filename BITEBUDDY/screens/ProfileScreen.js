import { View, Text, Alert, StyleSheet } from 'react-native';
import { signOut, getAuthUser } from "../data/DB";
import { Button } from '@rneui/themed';

function ProfileScreen() {
    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerText}>My Profile</Text>
            </View>
            <View>
                <Text>
                    You're signed in, {getAuthUser().displayName}!
                </Text>
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
})

export default ProfileScreen;