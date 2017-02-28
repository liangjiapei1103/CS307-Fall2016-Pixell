import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import { Header } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

import PickingImage  from './PickingImage';

class PostForm extends Component {

    state = {
        title: '',
        price: '',
        description: '',
        type: 'Seller',
        condition: 'Like New',
        pictures: [],
        pictureUrl1: '',
        pictureUrl2: '',
        pictureUrl3: ''
    }

    render() {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.props.cancelCreatePost();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>New Post</Title>

                        <Button transparent onPress={this.createPost.bind(this)}>
                            <Icon name='md-checkmark' />
                        </Button>
                </Header>
                <Content>
                    <List>
                        <ListItem>
                            <InputGroup>
                                <Input placeholder='Title'
                                       onChangeText={(title) => {
                                           console.log(title);
                                           this.setState({title});
                                       }}/>
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup>
                                <Input placeholder='Price'
                                       onChangeText={(price) => {
                                           console.log(price);
                                           this.setState({price});
                                       }}/>
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup >
                                <Input placeholder='Description' multiline={true}
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
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl1}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl2}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl3}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl4}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl5}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl6}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl7}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl8}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                        <ListItem>
                            <PickingImage pictureUrl={this.state.pictureUrl9}
                                          updateAvatarUrl={this.updateAvatarUrl1.bind(this)}/>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }

    updateAvatarUrl1(pictureUrl) {
        this.setState({pictureUrl1: pictureUrl});
        this.setState({pictures: [...this.state.pictures, pictureUrl]});
        console.log("current pictures: ", this.state.pictures);
    }

    updateAvatarUrl2(pictureUrl) {
        this.setState({pictureUrl2: pictureUrl});

        this.setState({pictures: [...this.state.pictures, pictureUrl]});
        console.log("current pictures: ", this.state.pictures);
    }

    updateAvatarUrl3(pictureUrl) {
        this.setState({pictureUrl3: pictureUrl});
        this.setState({pictures: [...this.state.pictures, pictureUrl]});
        console.log("current pictures: ", this.state.pictures);
    }

    onTypeChange (value: string) {
        console.log("Change post type to ", value);
        this.setState({type : value});
    }

    onConditionChange (value: string) {
        console.log("Change condition to ", value);
        this.setState({condition : value});
    }

    createPost() {
        console.log("this.props.userid: ", this.props.userid);
        axios.post(`https://purdue-pixell.herokuapp.com/api/user/${this.props.userid}/post`, {
            owner: this.props.userid,
            title: this.state.title,
            price: this.state.price,
            condition: this.state.condition,
            description: this.state.description,
            type: this.state.type,
            pictures: this.state.pictures
            })
            .then(function (response) {
                console.log("create post response: ", response);
            })
            .catch(function (error) {
                console.log(error);
        });

        this.props.onRefresh();
        this.props.cancelCreatePost();
        this.props.showTabbar();

    }
}

export { PostForm };
