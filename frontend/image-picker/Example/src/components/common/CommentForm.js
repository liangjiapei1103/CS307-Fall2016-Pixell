import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import { Header } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Card, CardItem, List, ListItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

class CommentForm extends Component {

    state = {
        content: '',
        postid: this.props.postid
    }

    render() {
        return (
            <Card style={{marginTop: 5}}>
                <CardItem header>
                    <Text>Make Comment</Text>
                </CardItem>

                <CardItem>
                    <InputGroup >
                        <Input placeholder='Enter Comment Here' multiline={true}
                               value={this.state.content}
                               onChangeText={(content) => {
                                   console.log(content);
                                   this.setState({content});
                               }}/>
                    </InputGroup>

                    <Button block info
                        onPress={this.commentOnPost.bind(this)}
                        style={{marginTop: 5}}>
                        Comment
                    </Button>
                </CardItem>
           </Card>
        );
    }

    commentOnPost() {
        console.log("You are trying to make comment");
        let that = this;
        axios.post('https://purdue-pixell.herokuapp.com/api/post/' + this.state.postid + '/comment', {
            content: this.state.content,
            })
            .then(function (response) {
                console.log("response", response);
                that.props.handleComment(response.data);
                that.setState({content: ''});
            })
            .catch(function (error) {
                console.log(error);
        });
    }
}

export { CommentForm };
