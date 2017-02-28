import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header, LoginForm } from './components/common';
import { MessageView, MarketView, ProfileView } from './components/';
import PickingImage from './components/common/PickingImage';
import Tabs from 'react-native-tabs';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 'Market',
            currentPost: null,
            posts: [],
            user: null,
            isCreatingPost: false,
            hidetabbar: false,
            isChatting: false,
            isChattingWith: null,
            contacts: [],
            choosingSortingOption: false,
            options : {
                timeNewToOld: true,
                timeOldToNew: false,
                priceLowToHigh: false,
                priceHighToLow: false,
                ratingLowToHigh: false,
                ratingHighToLow: false
            }
        };
    }

    componentWillMount() {
        console.log("PostList Updated");
        this.getPosts();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 18 }}>
                    {this.renderView(this.state.page)}
                </View>

                <View style={{ flex: 1 }}>
                    {this.renderTabbar()}
                </View>
            </View>
        );
    }

    renderView(page) {

        if (this.state.user) {
            if (page == 'Message') {
                console.log("this.state.isChattingWith: ", this.state.isChattingWith);
                return <MessageView
                            hideTabbar={this.hideTabbar.bind(this)}
                            showTabbar={this.showTabbar.bind(this)}
                            isChatting={this.state.isChatting}
                            beginChatting={this.beginChatting.bind(this)}
                            endChatting={this.endChatting.bind(this)}
                            contacts={this.state.contacts}
                            updateContacts={this.updateContacts.bind(this)}
                            userid = {this.state.user._id}
                            chattingWith={this.state.chattingWith}
                            isChattingWith={this.state.isChattingWith}
                       />
            } else if (page == 'Market') {
                return <MarketView getCurrentPost={this.getCurrentPost.bind(this)}
                                   removeCurrentPost={this.removeCurrentPost.bind(this)}
                                   posts={this.state.posts}
                                   currentPost={this.state.currentPost}
                                   isCreatingPost={this.state.isCreatingPost}
                                   createPost={this.createPost.bind(this)}
                                   cancelCreatePost={this.cancelCreatePost.bind(this)}
                                   getPosts={this.getPosts.bind(this)}
                                   userid = {this.state.user._id}
                                   hideTabbar={this.hideTabbar.bind(this)}
                                   showTabbar={this.showTabbar.bind(this)}
                                   changeToMessageView={this.changeToMessageView.bind(this)}
                                   user={this.state.user}
                                   updateUser={this.updateUser.bind(this)}
                                   choosingSortingOption={this.state.choosingSortingOption}
                                   beginChoosingSortingOption={this.beginChoosingSortingOption.bind(this)}
                                   cancelChoosingSortingOption={this.cancelChoosingSortingOption.bind(this)}
                                   getPostsWithSortingOption={this.getPostsWithSortingOption.bind(this)}
                                   options={this.state.options}
                                   selectTimeNewToOld={this.selectTimeNewToOld.bind(this)}
                                   selectTimeOldToNew={this.selectTimeOldToNew.bind(this)}
                                   selectPriceLowToHigh={this.selectPriceLowToHigh.bind(this)}
                                   selectPriceHighToLow={this.selectPriceHighToLow.bind(this)}
                                   selectRatingLowToHigh={this.selectRatingLowToHigh.bind(this)}
                                   selectRatingHighToLow={this.selectRatingHighToLow.bind(this)}
                                   updateIsChattingWith={this.updateIsChattingWith.bind(this)}
                                   />

            } else if (page == 'Profile') {
                return <ProfileView logout={this.logout.bind(this)}
                                    hideTabbar={this.hideTabbar.bind(this)}
                                    showTabbar={this.showTabbar.bind(this)}
                                    user={this.state.user}
                                    userid = {this.state.user._id}
                                    updateUser={this.updateUser.bind(this)}
                                    currentPost={this.state.currentPost}
                                    removeCurrentPost={this.removeCurrentPost.bind(this)}
                                    changeToMessageView={this.changeToMessageView.bind(this)}
                                    getPosts={this.getPosts.bind(this)}
                                    getCurrentPost={this.getCurrentPost.bind(this)}/>
            }
        } else {
            return <LoginForm login={this.login.bind(this)} signup={this.signup.bind(this)} />
        }
    }

    login(user) {
        console.log("Successfully login!");
        this.setState({ user: user, page: 'Market' });
    }

    logout() {
        console.log("Successfully logout!");
        this.setState({ user: null });
    }

    signup(user) {
        console.log("Successfully signup!");
        this.setState({ user: user, page: 'Market' });
    }

    getCurrentPost(post) {
        console.log("Successfully get currentPost", post);
        this.setState({ currentPost: post});
    }

    removeCurrentPost() {
        console.log("Successfully remove currentPost");
        this.setState({ currentPost: null});
    }

    createPost() {
        console.log("Begin to create post.");
        this.setState({isCreatingPost: true});
    }

    cancelCreatePost() {
        console.log("Cancel creating post.");
        this.setState({isCreatingPost: false});
    }



    getPosts() {
        axios.get('https://purdue-pixell.herokuapp.com/api/posts')
            .then((response) => {
                this.setState({ posts: response.data });
                console.log("get posts: ", response.data);
                console.log(this.state);
            });
    }

    getPostsWithSortingOption(options) {
        if (options.timeNewToOld) {
            console.log("You try to sort by time from New to Old");
            this.getPosts();
        } else if (options.timeOldToNew) {
            console.log("You try to sort by time from Old to New");
            axios.get('https://purdue-pixell.herokuapp.com/api/posts/timeAsc')
                .then((response) => {
                    this.setState({ posts: response.data });
                    console.log("get posts: ", response.data);
                    console.log(this.state);
                });
        } else if (options.priceLowToHigh) {
            console.log("You try to sort by price from Low to High");
            axios.get('https://purdue-pixell.herokuapp.com/api/posts/priceAsc')
                .then((response) => {
                    this.setState({ posts: response.data });
                    console.log("get posts: ", response.data);
                    console.log(this.state);
                });
        } else if (options.priceHighToLow) {
            console.log("You try to sort by price from High to Low");
            axios.get('https://purdue-pixell.herokuapp.com/api/posts/priceDes')
                .then((response) => {
                    this.setState({ posts: response.data });
                    console.log("get posts: ", response.data);
                    console.log(this.state);
                });
        } else if (options.ratingLowToHigh) {
            console.log("You try to sort by rating from Low to High");
        } else if (options.ratingHighToLow) {
            console.log("You try to sort by rating from High to Low");
        }
    }

    renderTabbar() {
        if (this.state.user && !this.state.hidetabbar) {
            return (
                <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
                      selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
                    <Text name="Message" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Message</Text>
                    <Text name="Market" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Market</Text>
                    <Text name="Profile" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Profile</Text>
                </Tabs>
            );
        } else {
            return;
        }
    }

    hideTabbar() {
        this.setState({hidetabbar: true});
    }

    showTabbar() {
        this.setState({hidetabbar: false});
    }

    changeToMessageView() {
        this.setState({page: 'Message', hidetabbar: true, isChatting: true});
    }

    updateUser(user) {
        this.setState({user});
    }

    beginChatting(user) {
        this.setState({isChatting: true});
        this.setState({isChattingWith: user._id});
    }

    endChatting() {
        this.setState({isChatting: false});
    }

    updateContacts(contacts) {
        this.setState({contacts});
        console.log('app contacts: ', this.state.contacts);
    }



    // Sorting options
    beginChoosingSortingOption() {
        console.log("Begin to choose sorting option.");
        this.setState({choosingSortingOption: true});
    }

    cancelChoosingSortingOption() {
        console.log("Cancel choosing sorting option.");
        this.setState({choosingSortingOption: false});
    }

    selectTimeNewToOld() {
        console.log("You want to sort by time from new to old.");
        this.setState({
            options: {
                timeNewToOld: true,
                timeOldToNew: false,
                priceLowToHigh: false,
                priceHighToLow: false,
                ratingLowToHigh: false,
                ratingHighToLow: false
            }
        });
    }

    selectTimeOldToNew() {
        this.setState({
            options: {
                timeNewToOld: false,
                timeOldToNew: true,
                priceLowToHigh: false,
                priceHighToLow: false,
                ratingLowToHigh: false,
                ratingHighToLow: false
            }
        });
    }

    selectPriceLowToHigh() {
        this.setState({
            options: {
                timeNewToOld: false,
                timeOldToNew: false,
                priceLowToHigh: true,
                priceHighToLow: false,
                ratingLowToHigh: false,
                ratingHighToLow: false
            }
        });
    }

    selectPriceHighToLow() {
        this.setState({
            options: {
                timeNewToOld: false,
                timeOldToNew: false,
                priceLowToHigh: false,
                priceHighToLow: true,
                ratingLowToHigh: false,
                ratingHighToLow: false
            }
        });
    }

    selectRatingLowToHigh() {
        this.setState({
            options: {
                timeNewToOld: false,
                timeOldToNew: false,
                priceLowToHigh: false,
                priceHighToLow: false,
                ratingLowToHigh: true,
                ratingHighToLow: false
            }
        });
    }

    selectRatingHighToLow() {
        this.setState({
            options: {
                timeNewToOld: false,
                timeOldToNew: false,
                priceLowToHigh: false,
                priceHighToLow: false,
                ratingLowToHigh: false,
                ratingHighToLow: true
            }
        })
    }

    updateIsChattingWith(user) {
        console.log("isChattingWith: ", user);
        this.setState({isChattingWith: user});
        console.log("isChattingWith update: ", this.state.isChattingWith);
    }

}

export default App;
