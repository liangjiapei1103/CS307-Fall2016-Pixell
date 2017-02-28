import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Text, Card, CardItem, List, ListItem, Thumbnail, Footer } from 'native-base';
import axios from 'axios';


class ChattingView extends Component {
  constructor(props) {
    super(props);

    this.onSend = this.onSend.bind(this);
    this.state = {
        messages: [],
        isChattingWith: this.props.isChattingWith
    };
  }



  componentWillMount() {
     console.log("chattingVIew isCHattingWith: ", this.props.isChattingWith);



     axios.get('https://purdue-pixell.herokuapp.com/api/user/' + this.props.isChattingWith)
     .then((response) => {
         console.log("ChattingView response: ", response.data);
         this.setState({isChattingWith: response.data});
         console.log("this.state.isChattingWith: ", this.state.isChattingWith);

         this.setState({
           messages: [
             {
               _id: 1,
               text: 'Hello developer',
               createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
               user: {
                 _id: 2,
                 name: 'React Native',
                 avatar: response.data.avatarUrl
               },
             }
           ],
         });
      });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    return (
        <Container>
            <Header>
                <Button transparent onPress={() => {
                        this.props.endChatting();
                        this.props.showTabbar();
                    }}>
                    <Icon name='ios-arrow-back' />
                </Button>

                <Title>{this.state.isChattingWith.username}</Title>
            </Header>

            <Content>
                <View>
                    {this.renderChat()}
                </View>
            </Content>
        </Container>

    );
  }

  renderChat() {
      return (
          <GiftedChat
             messages={this.state.messages}
             onSend={this.onSend}
             user={{
               _id: 1,
             }}
           />
      );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export { ChattingView };