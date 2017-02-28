import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { PostList, PostDetail } from './common';
import { PostForm, SortingOptions } from './common';
import axios from 'axios';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, Text, Card, CardItem, Thumbnail, Picker, Item } from 'native-base';

class MarketView extends Component {

    state = {
        posts: this.props.posts,
        keyword: '',
        currentPost: this.props.currentPost,
        isRefreshing: false,
        sortingOption: ''
    };


    componentWillMount() {
        console.log("MarketView user:", this.props.user);
    }

    createPost() {
        console.log("Create Post")
        this.props.createPost();
    }

    render() {
        if (this.props.currentPost) {
            return this.renderPost();
        } else {
            if (this.props.isCreatingPost) {
                return this.renderPostForm();
            } else if (this.props.choosingSortingOption) {
                return this.renderSortingOptions();
            } else {
                return this.renderMarket();
            }

        }
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
                           updateIsChattingWith={this.props.updateIsChattingWith}/>
    }

    renderMarket() {
        return (

            <Container>
                <Header>
                    <Button transparent
                            onPress={() => {
                                this.props.beginChoosingSortingOption();
                                this.props.hideTabbar();
                            }}
                    >
                        <Icon name='ios-menu' />
                    </Button>

                    <Title>Market</Title>

                    <Button transparent
                            onPress={() => {
                                this.props.createPost();
                                this.props.hideTabbar();
                            }}
                    >
                        <Icon name='md-add' />
                    </Button>
                </Header>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                    >
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
                </ScrollView>
            </Container>

        );
    }

    onPickerValueChange(value: string) {
        console.log("Sorting option changed");
        this.setState({sortingOption : value});
    }

    renderSortingOptionsPicker() {
        // return (
            // <Picker
            //     iosHeader="Select one"
            //     mode="dropdown"
            //     selectedValue={this.state.sortingOption}
            //     onValueChange={this.onPickerValueChange.bind(this)}>
            //     <Picker.Item label="Price: Low to High" value="Price: Low to High" />
            //     <Picker.Item label="Price: High to Low" value="Price: High to Low" />
            //     <Picker.Item label="Rating: Low to High" value="Rating: Low to High" />
            //     <Picker.Item label="Rating: High to Low" value="Rating: High to Low" />
            // </Picker>
        // );
    }

    renderPostList() {
        if (this.props.posts.length > 0) {
            return this.props.posts.map((post) => {
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
                                <Thumbnail square size={100} source={{uri: post.pictures[0] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                                <Thumbnail square size={100} source={{uri: post.pictures[1] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                                <Thumbnail square size={100} source={{uri: post.pictures[2] || 'https://pixabay.com/static/uploads/photo/2015/10/01/21/39/background-image-967820_960_720.jpg'}} />
                            </View>

                            <CardItem header onPress={this.handlePress.bind(this, post)}>
                                <Text>${post.price}</Text>
                            </CardItem>
                       </Card>
                   );
               }
           })
        } else {
            return;
        }
    }

    renderPostForm() {
        return <PostForm cancelCreatePost={this.props.cancelCreatePost}
                         onRefresh={this.onRefresh.bind(this)}
                         showTabbar={this.props.showTabbar}
                         userid={this.props.userid}/>
    }

    renderSortingOptions() {
        return (
            <SortingOptions cancelChoosingSortingOption={this.props.cancelChoosingSortingOption}
                            showTabbar={this.props.showTabbar}
                            getPostsWithSortingOption={this.props.getPostsWithSortingOption}
                            options={this.props.options}
                            selectTimeNewToOld={this.props.selectTimeNewToOld}
                            selectTimeOldToNew={this.props.selectTimeOldToNew}
                            selectPriceLowToHigh={this.props.selectPriceLowToHigh}
                            selectPriceHighToLow={this.props.selectPriceHighToLow}
                            selectRatingLowToHigh={this.props.selectRatingLowToHigh}
                            selectRatingHighToLow={this.props.selectRatingHighToLow}
                            />
        );
    }

    handlePress(post) {
        console.log("You press the post!");
        console.log("Current post: ", post);
        this.setState({currentPost: post});
        this.props.getCurrentPost(post);
        this.props.hideTabbar();
    }

    removeCurrentPost() {
        console.log("Remove currentPost");
        this.setState({currentPost: null});
        this.props.removeCurrentPost();
    }

    onRefresh() {
        console.log("this", this);
        this.setState({ isRefreshing: true });
        this.props.getPosts();
        this.setState({ isRefreshing: false });
    }
}

export { MarketView };
