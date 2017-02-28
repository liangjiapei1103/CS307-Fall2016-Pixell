import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ContactList } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content } from 'native-base';
import { ChattingView } from './';

class MessageView extends Component {

    // constructor(props) {
    //     super(props);
    //
    // }

    state = {
        keyword: ''
    };

    render() {
        if (this.props.isChatting) {
            return this.renderChattingView();
        } else {
            return this.renderContactList();
        }
    }

    renderContactList() {

        var that = this;

        return (
            <Container>
                <Header>
                    <Button transparent>
                        <Icon name='ios-menu' />
                    </Button>

                    <Title>Message</Title>
                </Header>
                <Content>
                    <InputGroup>
                        <Icon name='ios-search' />
                            <Input placeholder='Search'
                                   autoCapitalize='none'
                                   value={this.state.keyword}
                                   onChangeText={(keyword) => {
                                       this.setState({keyword});
                                   }}/>
                        <Icon name='ios-close-circle'
                              onPress={() => {
                                  console.log("You press the delete icon");
                                  this.setState({keyword: ''});
                              }}/>
                    </InputGroup>
                    <ContactList keyword={this.state.keyword}
                                 beginChatting={this.props.beginChatting}
                                 hideTabbar={this.props.hideTabbar}
                                 contacts={this.props.contacts}
                                 updateContacts={this.props.updateContacts}
                                 userid = {this.props.userid}
                                 chattingWith={this.props.chattingWith}
                    />
                </Content>
            </Container>
        );
    }

    renderChattingView() {
        console.log("MessageView isChattingWith: ", this.props.isChattingWith);
        return (
            <ChattingView endChatting={this.props.endChatting}
                          showTabbar={this.props.showTabbar}
                          chattingWith={this.props.chattingWith}
                          isChattingWith={this.props.isChattingWith}
            />
        );
    }
}

export { MessageView };
