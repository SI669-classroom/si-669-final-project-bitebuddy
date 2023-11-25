
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut as fbSignOut,
    initializeAuth,
    getReactNativePersistence,
    onAuthStateChanged
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { setUser } from './Actions';
import { firebaseConfig } from '../Secrets';

let app, auth;

const apps = getApps();
if (apps.length == 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = apps[0];
}

try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} catch (error) {
    auth = getAuth(app); // if auth already initialized
}

const subscribeToAuthChanges = (navigation, dispatch) => {
    onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
            console.log('got an auth change:', authUser);
            dispatch(setUser(authUser));
            navigation.navigate('TabsNavigator', {
                screen: 'Explore',
                params: {
                    screen: 'Home',
                },
            });
        } else {
            console.log('user is signed out!');
            navigation.navigate('Login');
        }
    })
}

const signIn = async (email, password, dispatch) => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        // Assuming you want to set the user right after signing in:
        dispatch(setUser(userCred.user));
    } catch (error) {
        console.error('Error during sign in:', error);
        // Handle the error appropriately
    }
}

const signUp = async (displayName, email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: displayName });
    return userCred.user;
}


const signOut = async () => {
    await fbSignOut(auth);
}

const getAuthUser = () => {
    return auth.currentUser;
}

export { signUp, signIn, signOut, getAuthUser, subscribeToAuthChanges };