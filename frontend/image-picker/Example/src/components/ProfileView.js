import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
// import { Header, Button, Card, CardSection } from './common';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Radio, Thumbnail, Card, CardItem } from 'native-base';
import { MyPosts, MyWishlist, MyOrder } from './';
import { EditProfileForm } from './common';
import axios from 'axios';

class ProfileView extends Component {

    state = {
        page: 'profile', // profile, myposts, wishlist, myorderhistory
        user: this.props.user
    }

    render() {
        console.log("avatarUrl", 'http:' + this.props.user.avatarUrl);
        if (this.state.page == 'profile') {
            return this.renderProfile();
        } else if (this.state.page == 'myposts') {
            return this.renderMyPosts();
        } else if (this.state.page == 'mywishlist') {
            return this.renderMyWishlist();
        } else if (this.state.page == 'myorder') {
            return this.renderMyOrder();
        } else if (this.state.page == 'editprofile') {
            return this.renderEditProfileForm();
        }
    }


    renderProfile() {
        return (
            <Container>
                <Header>
                    <Title>Profile</Title>
                </Header>
                <Content>
                    <Card style={{marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <CardItem>
                                    <Image style={{width: 80, height: 80, margin: 5}} source={{uri: this.props.user.avatarUrl}} />
                                </CardItem>
                                <CardItem style={{justifyContent: 'space-around'}} onPress={() => {
                                        this.setState({page: 'editprofile'});
                                        this.props.hideTabbar();
                                    }}>
                                    <Text><Text style={{fontWeight: 'bold'}}>{this.props.user.username}</Text></Text>
                                    <Text><Text style={{fontWeight: 'bold'}}>{this.props.user.email}</Text></Text>
                                    <Text>Raiting: <Text style={{color: 'red'}}>&#9733; &#9733; &#9733; &#9733; &#9733;</Text></Text>
                                </CardItem>
                            </View>

                            <Icon style={{marginRight: 15}} name='ios-arrow-forward' />
                    </Card>

                    <Card>
                        <CardItem style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}
                                  onPress={() => {
                                      this.setState({page: 'myposts'});
                                      this.props.hideTabbar();
                                  }}>
                            <Text> </Text>
                            <Text>My Posts</Text>
                            <Icon name='ios-arrow-forward' />
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}
                                  onPress={() => {
                                      this.setState({page: 'mywishlist'});
                                      this.props.hideTabbar();
                                  }}>
                            <Text> </Text>
                            <Text>My WishList</Text>
                            <Icon name='ios-arrow-forward' />
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}
                                  onPress={() => {
                                      this.setState({page: 'myorder'});
                                      this.props.hideTabbar();
                                  }}>
                            <Text> </Text>
                            <Text>My Order History</Text>
                            <Icon name='ios-arrow-forward' />
                        </CardItem>
                    </Card>

                    <Button block danger
                        style={{marginTop: 20}}
                        onPress={() => {
                            this.props.logout();
                        }}>
                        Logout
                    </Button>
                </Content>
            </Container>
        );
    }

    renderMyPosts() {
        return <MyPosts backToProfile={this.backToProfile.bind(this)}
                        showTabbar={this.props.showTabbar}
                        hideTabbar={this.props.hideTabbar}
                        user={this.props.user}
                        userid={this.props.userid}
                        currentPost={this.props.currentPost}
                        getCurrentPost={this.props.getCurrentPost}
                        getPosts={this.props.getPosts}
                        removeCurrentPost={this.props.removeCurrentPost}/>;
    }

    renderMyWishlist() {
        return <MyWishlist backToProfile={this.backToProfile.bind(this)}
                        showTabbar={this.props.showTabbar}
                        hideTabbar={this.props.hideTabbar}
                        user={this.props.user}
                        userid={this.props.userid}
                        currentPost={this.props.currentPost}
                        getCurrentPost={this.props.getCurrentPost}
                        getPosts={this.props.getPosts}
                        removeCurrentPost={this.props.removeCurrentPost}
                        changeToMessageView={this.props.changeToMessageView}
                        updateUser={this.props.updateUser}/>;
    }
    renderMyOrder() {
        return <MyOrder backToProfile={this.backToProfile.bind(this)}
                        showTabbar={this.props.showTabbar}
                        hideTabbar={this.props.hideTabbar}
                        user={this.props.user}
                        userid={this.props.userid}
                        currentPost={this.props.currentPost}
                        getCurrentPost={this.props.getCurrentPost}
                        getPosts={this.props.getPosts}
                        removeCurrentPost={this.props.removeCurrentPost}
                        changeToMessageView={this.props.changeToMessageView}
                        updateUser={this.props.updateUser}/>;
    }

    renderEditProfileForm() {
        return <EditProfileForm backToProfile={this.backToProfile.bind(this)}
                        showTabbar={this.props.showTabbar}
                        user={this.props.user}
                        updateUser={this.props.updateUser}
                        username={this.props.user.username}/>;
    }

    backToProfile() {
        this.setState({page: 'profile'});
    }
}

export { ProfileView };