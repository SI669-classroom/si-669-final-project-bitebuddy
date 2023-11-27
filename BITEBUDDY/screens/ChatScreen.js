import { Button, Input, Icon } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentChatMessage, unsubscribeFromChat } from '../data/Actions';


function ChatScreen({navigation, route}) {
  console.log('route:',route);
  const {currentUserId, otherUserId} = route.params;

  //  const [messages, setMessages] = useState(dummyChat);
  const [inputText, setInputText] = useState('');

  const currentChat = useSelector(state => state.currentChat);
  console.log('currentChat89', currentChat);
  console.log('currentUserId', currentUserId);
  const currentUser = useSelector(state => state.users.find(u=>u.key===currentUserId));
  const otherUser = useSelector(state => state.users.find(u=>u.key===otherUserId));
  console.log('currentChat90', currentUser,otherUser);
  // const currentUser = useSelector(state => state.users.find(u => u.key === currentUserId)) || {};
  // const otherUser = useSelector(state => state.users.find(u => u.key === otherUserId)) || {};

  const messages = currentChat?.messages ?? [];
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Current Chat in ChatScreen:', currentChat);
    // other code...
  }, [currentChat]);

  useEffect(()=>{
    return ()=>{
      unsubscribeFromChat();
    }
  }, []);

  return (
    <View style={styles.container} >
      <KeyboardAvoidingView 
        behavior='position'>
      <View style={styles.header}>
        <TouchableOpacity 
            style={styles.headerLeft}
            onPress={()=>navigation.navigate('Home')}>
          <Icon
            name="arrow-back"
            color="black"
            type="material"
            size={32}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Chat with {otherUser.displayName} </Text>
        </View>
        <View style={styles.headerRight}>

        </View>
      </View>
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
        >
          {messages.map(msg => {
            return (
              <View 
                key={msg.timestamp}
                style={[styles.messageBubble, 
                  msg.author === currentUser.key ?
                  styles.self :
                  styles.other 
                ]}>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Input
          containerStyle={styles.inputBox}
          placeholder="Enter chat message"
          value={inputText}
          onChangeText={text=>setInputText(text)}
        />
        <Button
          buttonStyle={styles.sendButton}
          onPress={()=>{
            dispatch(addCurrentChatMessage({
              author: currentUser.key,
              message: inputText,
              timestamp: new Date()
            }))
            // setMessages(messages.concat({
            //   author: currentUser,
            //   message: inputText,
            //   timestamp: Date.now()
            // }));
            setInputText('');
          }}
        >
          <Icon 
            name="send"
            size={32}
            color="purple"  
          />
        </Button>
      </View>
    </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white'
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'flex-end',
    width: '100%',
    padding: '3%'
  },
  headerLeft: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  headerCenter: {
    flex: 0.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerRight: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32
  },
  body: {
    flex: 0.8,
    width: '100%',
    justifyContent: 'flex-end', 
    alignItems: 'stretch',
    padding: '3%',
  },
  scrollContainer: {
    flex: 1.0, 
    width: '100%',
    justifyContent: 'flex-end', 
    alignItems: 'stretch',
    padding: '3%',
  },
  messageBubble: {
    borderRadius: 6,
    padding: '2%'
  },
  messageText: {
    fontSize: 18
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightgreen'
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgray'
  },
  footer: {
    flex: 0.1, 
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    padding: '3%'
  },
  inputBox: {
    width: '80%'
  },
  sendButton: {
    backgroundColor: 'white',
  }
});

export default ChatScreen;
