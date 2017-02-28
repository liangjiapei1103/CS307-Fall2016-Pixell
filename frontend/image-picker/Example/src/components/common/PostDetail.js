import React, { Component } from 'react';
import { View, Image } from 'react-native';
import axios from 'axios';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Text, Card, CardItem, List, ListItem, Thumbnail } from 'native-base';
import { PostEditForm, CommentList, CommentForm } from './';

class PostDetail extends Component {

    state = {
        isEditing: false,
        post: this.props.post,
        comments: this.props.post.comments,
        isInWishlist: false,
        userid: this.props.userid,
        user: this.props.user,
        isProcess: false
    };

    componentWillMount() {
        console.log("Hello");
        console.log("PostDetail user:", this.state.user);
        console.log("Post comments: ", this.props.post.comments);
        var index = this.state.user.wishlist.indexOf(this.state.post._id);
        if (index >= 0) {
            this.setState({isInWishlist: true});
        }
    }

    render() {
        // console.log(this.props);

        if (this.state.isEditing) {
            return this.renderEditForm(this.state.post);
        } else {
            return this.renderPostDetail(this.state.post);
        }
    }

    renderEditForm(post) {
        return <PostEditForm post={post}
                             cancelEditing={this.cancelEditing.bind(this)}
                             onRefresh={this.props.onRefresh}
                             getPostDetail={this.getPostDetail.bind(this)}
                             handleBack={this.handleBack.bind(this)}/>;
    }

    renderEditButton() {
        console.log("this.props.userid: ", this.props.userid);
        if (this.state.post.owner._id == this.props.userid) {
            return (
                <Button transparent onPress={this.handleEdit.bind(this)}>
                    <Icon name='ios-create-outline' />
                </Button>
            );
        } else {
            return (
                <Button transparent onPress={() => {
                        console.log("you try to add this post to your wishlist");
                        axios.get(`https://purdue-pixell.herokuapp.com/api/user/${this.state.userid}/post/${this.state.post._id}/wishlist/toggle`)
                        .then(response => {
                            console.log(response.data);
                            this.props.updateUser(response.data);
                            // this.setState({user: response.data});
                            this.setState({isInWishlist: !this.state.isInWishlist});
                            this.props.onRefresh();
                        });
                    }}>
                    <Icon style={ this.state.isInWishlist ? {color: 'red'} : {color: 'grey'}} name='md-heart' />
                </Button>
            );
        }

    }

    renderPostDetail(post) {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.handleBack();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>{post.title}</Title>

                    {this.renderEditButton()}
                </Header>

                <Content>
                    <Card>
                        <CardItem>
                            <Text>
                                price: {post.price}
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Text>
                                Description: {post.description}
                            </Text>
                            <Text note>createdAt: {post.createdAt}</Text>
                        </CardItem>
                        <CardItem>
                            <Text>
                                owner: {post.owner.username || post.owner.email}
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Text>
                                likesnum: {post.likesnum || 0}
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Text>
                                viewsnum: {post.viewsnum || 0}
                            </Text>
                        </CardItem>


                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Thumbnail square size={100} source={{uri: post.pictures[0] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[1] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[2] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Thumbnail square size={100} source={{uri: post.pictures[3] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[4] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[5] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Thumbnail square size={100} source={{uri: post.pictures[6] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[7] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            <Thumbnail square size={100} source={{uri: post.pictures[8] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                        </View>

                        {this.renderIWantItButton()}

                        <CommentForm postid={this.props.post._id}
                                     handleComment={this.handleComment.bind(this)}/>

                        <CommentList comments={this.state.comments}/>
                    </Card>
                </Content>

            </Container>
        );
    }

    renderIWantItButton() {
        if (this.state.post.owner._id !== this.props.userid) {
            return (
                <Button block success
                    onPress={() => {
                        this.handlePress();
                    }}
                    style={{margin: 10}}>
                    I Want it
                </Button>
            );
        }
    }

    handleBack() {
        console.log(this.props);
        this.props.removeCurrentPost();
    }

    handleEdit() {
        console.log(this.props);
        this.setState({isEditing: true});
    }

    cancelEditing() {
        console.log("Cancel Editing");
        this.setState({isEditing: false});
    }

    getPostDetail(post) {
        console.log("Get post detail: ", post);
        this.setState({post});
    }

    handleComment(comment) {
        console.log("Handle Comment");
        console.log(comment);
        this.setState({
            comments: [...this.state.post.comments, comment],
        });
        this.props.onRefresh();
    }

    handlePress() {
        console.log("You are tying to chat with the user who made this post.")
        this.chatWith();
        this.addToOrderHistory();
        this.props.removeCurrentPost();
        this.props.changeToMessageView();
    }


    createOrGetRoom() {
        axios.post('http://localhost:3000/rooms/new_room', {
            between: [this.props.userid, this.props.post.owner],
            postId: this.props.post._id,
            userId: this.props.userid,
            postOwner: this.props.post.owner
        });
    }

    addToOrderHistory() {
        axios.get(`https://purdue-pixell.herokuapp.com/user/${this.props.userid}/post/${this.props.post._id}/orderHistory/add`)
        .then(response => console.log(response.data))
        .catch(error => console.log(error));
    }

    chatWith() {
        axios.get('https://purdue-pixell.herokuapp.com/api/user/' + this.props.userid + '/owner/' + this.props.post.owner._id +'/chat')
        .then((response) => {
            console.log("response.data: ", response.data);
            // this.props.updateIsChattingWith(response.data);
        })
        this.props.updateIsChattingWith(this.props.post.owner._id);
    }
}

export { PostDetail };
