import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Comment } from './';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

class CommentList extends Component {

    render() {
        return (
            <List style={{marginTop: 10}}>
                <ListItem itemDivider>
                    <Text>Comments: </Text>
                </ListItem>

                {this.renderCommentList()}
            </List>
        );
    }

    renderCommentList() {
        if (this.props.comments.length > 0) {
            return this.props.comments.map((comment) => {
                    return <Comment comment={comment} key={comment._id}/>
                });
        } else {
            return (
                <ListItem>
                    <Text>No Comments</Text>
                </ListItem>
            );
        }
    }
}

export { CommentList };
