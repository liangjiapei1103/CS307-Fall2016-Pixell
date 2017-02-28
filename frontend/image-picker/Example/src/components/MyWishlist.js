import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { PostList, PostDetail, PostForm } from './common';
import axios from 'axios';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Text, Card, CardItem, Thumbnail } from 'native-base';

class MyWishlist extends Component {

    state = {
        posts: [],
        keyword: '',
        currentPost: this.props.currentPost
    };

    componentWillMount() {
        this.getMyWishlist();
    }

    getMyWishlist() {
        axios.get(`https://purdue-pixell.herokuapp.com/api/user/${this.props.user._id}/wishlist`)
        .then((response) => {
            console.log(response);
            this.setState({posts: response.data})
            console.log("Wishlist: ", response.data);
        });
    }

    renderPostList() {
        return this.state.posts.map((post) => {
            if ((post.type == 'Seller' && post.title.toUpperCase().includes(this.state.keyword.toUpperCase()))
                || (post.type == 'Buyer' && post.title.toUpperCase().includes(this.state.keyword.toUpperCase()))
            ) {
                return (
                    <Card key={post._id}
                            style={{margin: 5}}
                            >
                        <CardItem header onPress={this.handlePress.bind(this, post)}>
                            <Text>{post.title}</Text>
                        </CardItem>

                        <CardItem onPress={this.handlePress.bind(this, post)}>
                            <Text>
                                {post.description}
                            </Text>
                        </CardItem>

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Thumbnail square size={100} source={{uri: 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                        </View>

                        <CardItem header onPress={this.handlePress.bind(this, post)}>
                            <Text>${post.price}</Text>
                        </CardItem>
                    </Card>
                );
            }
        });
    }

    handlePress(post) {
        console.log("You press the post!");
        console.log("Current post: ", post);
        this.setState({currentPost: post});
        this.props.getCurrentPost(post);
        this.props.hideTabbar();
        console.log("Props Current post: ", this.props.currentPost);
        console.log("State Current post: ", this.state.currentPost);
    }

    renderPost() {
        return <PostDetail post={this.props.currentPost}
                           removeCurrentPost={this.removeCurrentPost.bind(this)}
                           onRefresh={this.onRefresh.bind(this)}
                           userid={this.props.userid}
                           showTabbar={this.props.showTabbar}
                           changeToMessageView={this.props.changeToMessageView}
                           user={this.props.user}
                           updateUser={this.props.updateUser}
                           getMyWishlist={this.getMyWishlist.bind(this)}/>
    }

    renderMyWishlist() {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.props.backToProfile();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>My Wishlist</Title>

                    {/*<Button transparent
                            onPress={this.props.createPost}
                    >
                        <Icon name='md-add' />
                    </Button>*/}
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
                    {this.renderPostList()}
                </Content>

            </Container>
        );

    }

    removeCurrentPost() {
        console.log("Remove currentPost");
        this.setState({currentPost: null});
        this.props.removeCurrentPost();
    }

    onRefresh() {
        this.props.getPosts();
        this.getMyWishlist();
    }

    render() {
        if (this.props.currentPost) {
            return this.renderPost();
        } else {
            return this.renderMyWishlist();
        }
    }
}


export { MyWishlist };
