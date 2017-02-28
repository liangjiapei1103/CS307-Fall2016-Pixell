import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import { Header } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Card, CardItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

class Comment extends Component {
    render() {
        return (
            <Card style={{marginTop: 5}}>
                <CardItem>
                    <Text>User: {this.props.comment.owner}</Text>
                </CardItem>
                <CardItem>
                    <Text>{this.props.comment.content}</Text>
                </CardItem>
                <CardItem>
                    <Text>Created At: {this.props.comment.createdAt}</Text>
                </CardItem>
            </Card>
        );
    }
}

export { Comment };
