import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PickingImage from './PickingImage';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Item, Radio } from 'native-base';
import axios from 'axios';

import { RNS3 } from 'react-native-aws3';
import uuidV4 from 'uuid/v4';


class EditProfileForm extends Component {

    state = {
        username: this.props.username,
        avatarUrl: this.props.user.avatarUrl
    }

    render() {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.props.backToProfile();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>Edit Profile</Title>

                        <Button transparent onPress={this.editProfile.bind(this)}>
                            <Icon name='md-checkmark' />
                        </Button>
                </Header>
                <Content>

                    <PickingImage avatarUrl={this.state.avatarUrl}
                                  updateUser={this.props.updateUser}
                                  user={this.props.user}
                                  updateAvatarUrl={this.updateAvatarUrl.bind(this)}/>

                    <List>
                        <ListItem>
                            <InputGroup>
                                <Input placeholder='username'
                                       inlineLabel label='Username:'
                                       autoCorrect={false}
                                       autoCapitalize='none'
                                       value={this.state.username}
                                       onChangeText={(username) => {
                                           console.log(username);
                                           this.setState({username});
                                       }}/>
                            </InputGroup>
                        </ListItem>
                    </List>
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

    updateAvatarUrl(avatarUrl) {
        this.setState({avatarUrl});
        console.log("this.state.avatarUrl: ", this.state.avatarUrl);
    }

    editProfile() {

        axios.post(`https://purdue-pixell.herokuapp.com/api/user/${this.props.user._id}/edit`, {
            username: this.state.username,
            avatarUrl: this.state.avatarUrl
            })
            .then((response) => {
                console.log(response);
                this.props.updateUser(response.data);
            })
            .catch(function (error) {
                console.log(error);
        });

        this.props.backToProfile();
        this.props.showTabbar();

        // });


    }


}

export { EditProfileForm };
