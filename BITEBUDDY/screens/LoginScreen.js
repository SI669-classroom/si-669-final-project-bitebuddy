import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '@rneui/themed';
import { addUser } from '../data/Actions';
import { signIn, signUp, subscribeToAuthChanges } from '../data/DB';
import logo from '../assets/logo.png';

function SigninBox({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            await signIn(email, password, dispatch);

        } catch (error) {
            Alert.alert("Sign In Error", error.message, [{ text: "OK" }]);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Image source={logo} style={styles.image} />
            <Text style={styles.loginHeaderText}>Sign In</Text>

            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Email: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput
                        style={styles.loginInputBox}
                        placeholder='enter email address'
                        autoCapitalize='none'
                        spellCheck={false}
                        onChangeText={text => setEmail(text)}
                        value={email}
                    />
                </View>
            </View>
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Password: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput
                        style={styles.loginInputBox}
                        placeholder='enter password'
                        autoCapitalize='none'
                        spellCheck={false}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                        value={password}
                    />
                </View>
            </View>
            <View style={styles.loginRow}>
                <Button
                    onPress={handleSignIn}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
}


function SignupBox({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleSignUp = async () => {
        try {
            const authUser = await signUp(displayName, email, password);
            dispatch(addUser(authUser));
        } catch (error) {
            Alert.alert("Sign Up Error", error.message, [{ text: "OK" }]);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Image source={logo} style={styles.image} />
            <Text style={styles.loginHeaderText}>Sign Up</Text>
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Display Name: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput
                        style={styles.loginInputBox}
                        placeholder='enter display name'
                        autoCapitalize='none'
                        spellCheck={false}
                        onChangeText={text => setDisplayName(text)}
                        value={displayName}
                    />
                </View>
            </View>
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Email: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput
                        style={styles.loginInputBox}
                        placeholder='enter email address'
                        autoCapitalize='none'
                        spellCheck={false}
                        onChangeText={text => setEmail(text)}
                        value={email}
                    />
                </View>
            </View>

            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Password: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput
                        style={styles.loginInputBox}
                        placeholder='enter password'
                        autoCapitalize='none'
                        spellCheck={false}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                        value={password}
                    />
                </View>
            </View>
            <View style={styles.loginRow}>
                <Button onPress={handleSignUp}>
                    Sign Up
                </Button>
            </View>
        </View>
    );
}

function LoginScreen({ navigation }) {

    const [loginMode, setLoginMode] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        subscribeToAuthChanges(navigation, dispatch);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                {loginMode ?
                    <SigninBox navigation={navigation} />
                    :
                    <SignupBox navigation={navigation} />
                }
            </View>
            <View styles={styles.modeSwitchContainer}>
                {loginMode ?
                    <Text>New user?
                        <Text
                            onPress={() => { setLoginMode(!loginMode) }}
                            style={{ color: 'blue' }}> Sign up </Text>
                        instead!
                    </Text>
                    :
                    <Text>Returning user?
                        <Text
                            onPress={() => { setLoginMode(!loginMode) }}
                            style={{ color: 'blue' }}> Sign in </Text>
                        instead!
                    </Text>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'tan'
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingTop: '20%',
        paddingBottom: '10%',
        //backgroundColor: 'lightblue'
    },
    loginHeader: {
        width: '100%',
        padding: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'tan'
    },
    loginHeaderText: {
        fontSize: 24,
        color: 'black',
        paddingBottom: '5%'
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        //backgroundColor: 'pink',
        padding: '3%'
    },
    loginLabelContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    loginLabelText: {
        fontSize: 18
    },
    loginInputContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%'
    },
    loginInputBox: {
        width: '100%',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 18,
        padding: '2%'
    },
    modeSwitchContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'pink'
    },
    loginButtonRow: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        flex: 0.7,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    image: {
        marginVertical: 20,
        width: 210,
        height: 200
    },
});

export default LoginScreen;