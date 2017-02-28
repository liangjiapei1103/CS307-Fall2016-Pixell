import React, { Component } from 'react';
import { ScrollView, Text, RefreshControl, View, Switch } from 'react-native';
import { Post, SearchBar } from '../common';
import axios from 'axios';

class PostList extends Component {

    state = { posts: [],
        isRefreshing: false,
        keyword: '',
        viewSeller: true,
        viewBuyer: true
    };

    componentWillMount() {
        console.log("PostList Updated");
        axios.get('https://purdue-pixell.herokuapp.com/api/posts')
            .then((response) => this.setState({ posts: response.data }));
    }

    renderPosts() {
        return this.state.posts.map((post) => {
            if ((post.type == 'Seller' && this.state.viewSeller && post.title.includes(this.state.keyword))
                || (post.type == 'Buyer' && this.state.viewBuyer && post.title.includes(this.state.keyword))
            ) {
                return (
                    <Post key={post._id}
                          title={post.title || "No Title"}
                          price={post.price || 0}
                          condition={post.condition || "Like New"}
                          description={post.description || "No Description"}
                          onPostPress={() => {
                              console.log("You press the post", post.title);
                          }}
                    />
                );
            }
        });
    }

    _onRefresh() {
        console.log("this", this);
        this.setState({ isRefreshing: true });
        axios.get('https://purdue-pixell.herokuapp.com/api/posts')
            .then((response) => {
                this.setState({ posts: response.data, isRefreshing: false });

            });
    }

    render() {
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 36}}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor="#ff0000"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                progressBackgroundColor="#ffff00"
                            />
                        }
                    >
                        {this.renderPosts()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export { PostList };
