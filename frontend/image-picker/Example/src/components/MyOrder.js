import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { PostList, PostDetail, PostForm, Rating } from './common';
import axios from 'axios';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Text, Card, CardItem, Thumbnail } from 'native-base';

class MyOrder extends Component {

    state = {
        posts: [],
        keyword: '',
        currentPost: this.props.currentPost,
        rate: false,
        rateUser: null,
        ratePost: null
    };

    componentWillMount() {
        this.getMyOrderlist();
    }

    getMyOrderlist() {
        axios.get(`https://purdue-pixell.herokuapp.com/api/user/${this.props.userid}/orderHistory`)
        .then((response) => {
            console.log("orderHistory response: ", response);
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
                        <CardItem header>
                            {this.renderEndButton(post)}
                        </CardItem>
                    </Card>
                );
            }
        });
    }
    renderEndButton(post) {
        console.log("post is avalability ",post);
        if (post.avalability == true) {
            return (
                <Button block onPress={this.handleEnd.bind(this, post)} style={{width: 320}}> End transaction </Button>
            );
        }
        else{
            return (
                <Button block onPress={this.handleRate.bind(this, post)} style={{width: 320}}> Rate for the Seller </Button>
            );
        }
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
    handleRate(post){
        console.log("You press the rate!");
        this.setState({rateUser: post.owner._id});
        this.setState({ratePost: post._id});
        this.setState({rate: true});
    }
    handleEnd(post) {
        console.log("end transaction!");
        axios.post(`https://purdue-pixell.herokuapp.com/post/${post._id}/done`)
        .then((response) => {
            console.log("end transaction: ",response);
        });
        this.onRefresh();
    }
    backToOrder(){
        this.setState({rate: false});
        console.log("rate is===:", this.state.rate);
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
                           getMyWishlist={this.getMyOrderlist.bind(this)}
                           />
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

                    <Title>My Order History</Title>

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
    renderRate(){
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.backToOrder();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>Rate to Seller</Title>

                    {/*<Button transparent
                            onPress={this.props.createPost}
                    >
                        <Icon name='md-add' />
                    </Button>*/}
                </Header>
                <Content>
                <Rating id = {this.state.rateUser}
                        postid = {this.state.ratePost}
                        backProfile = {this.props.backToProfile.bind(this)}
                        showTabbar  = {this.props.showTabbar()}

                />
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
        this.getMyOrderlist();
    }

    render() {
        console.log("the page is", this.state.rate);
        if (this.props.currentPost) {
            return this.renderPost();
        } else{
         if(this.state.rate == true){
            return this.renderRate();
         }
         else{
            return this.renderMyWishlist();
         }
        }
    }
}


export { MyOrder };
