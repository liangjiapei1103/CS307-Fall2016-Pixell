import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import { Header } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

class PostEditForm extends Component {

    state = {
        title: this.props.post.title,
        price: this.props.post.price,
        description: this.props.post.description,
        type: this.props.post.type,
        condition:  this.props.post.condition,
        postid: this.props.post._id
    }

    render() {
        console.log("props", this.props);
        return (
            <Container>
                <Header>
                    <Button transparent onPress={this.props.cancelEditing}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>Edit Post</Title>

                        <Button transparent onPress={this.editPost.bind(this)}>
                            <Icon name='md-checkmark' />
                        </Button>
                </Header>
                <Content>
                    <List>
                        <ListItem>
                            <InputGroup>
                                <Input placeholder='Title'
                                       value={this.state.title}
                                       onChangeText={(title) => {
                                           console.log(title);
                                           this.setState({title});
                                       }}/>
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup>
                                <Input placeholder='Price'
                                       value={this.state.price.toString()}
                                       onChangeText={(price) => {
                                           console.log(price);
                                           this.setState({price});
                                       }}/>
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup >
                                <Input placeholder='Description' multiline={true}
                                       value={this.state.description}
                                       onChangeText={(description) => {
                                           console.log(description);
                                           this.setState({description});
                                       }}/>
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <Text style={{marginLeft: 10}}>Post as: </Text>
                            <Picker
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={this.state.type}
                                onValueChange={this.onTypeChange.bind(this)}>
                                <Picker.Item label="Seller" value="Seller" />
                                <Picker.Item label="Buyer" value="Buyer" />
                           </Picker>
                        </ListItem>

                        <ListItem>
                            <Text style={{marginLeft: 10}}>Condition: </Text>
                            <Picker
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={this.state.condition}
                                onValueChange={this.onConditionChange.bind(this)}>
                                <Picker.Item label="New" value="New" />
                                <Picker.Item label="Like New" value="Like New" />
                                <Picker.Item label="Good" value="Good" />
                                <Picker.Item label="Usable" value="Usable" />
                                <Picker.Item label="Broken" value="Broken" />
                           </Picker>
                        </ListItem>
                    </List>

                    <Button block danger
                        onPress={() => {
                            this.deletePost();
                        }}
                        style={{margin: 10}}>
                        Delete Post
                    </Button>
                </Content>
            </Container>
        );
    }

    onTypeChange (value: string) {
        console.log("Change post type to ", value);
        this.setState({type : value});
    }

    onConditionChange (value: string) {
        console.log("Change condition to ", value);
        this.setState({condition : value});
    }

    editPost() {
        console.log("postid: ", this.state.postid);
        var that = this;
        axios.post('https://purdue-pixell.herokuapp.com/user/123/post/' + this.state.postid + '/edit', {
            title: this.state.title,
            price: this.state.price,
            condition: this.state.condition,
            description: this.state.description,
            type: this.state.type
            })
            .then(function (response) {
                console.log(response);
                that.props.getPostDetail(response.data);
            })
            .catch(function (error) {
                console.log(error);
        });

        this.props.onRefresh();
        this.props.cancelEditing();
    }

    deletePost() {
        axios.get('https://purdue-pixell.herokuapp.com/user/123/post/' + this.state.postid + '/delete');
        this.props.onRefresh();
        this.props.cancelEditing();
        this.props.handleBack();
    }
}

export { PostEditForm };
