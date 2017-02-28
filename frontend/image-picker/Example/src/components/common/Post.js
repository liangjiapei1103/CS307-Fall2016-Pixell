import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { Card, CardSection } from '../common';

class Post extends Component {



    handlePress = () => {
        console.log("You press the post.");
    };

    render(props) {

        const { bottomSectionStyles, likeSymbolStyle, ratingStyle, thumbnailStyle, thumbnailContainerStyle, postDetailContainerStyle, descriptionContainerStyle, titleStyle, priceStyle, conditionStyle, descriptionStyle } = styles;

        return (
            <TouchableWithoutFeedback onPress={this.props.onPostPress}>
                <View>
                    <Card>
                        <View style={postDetailContainerStyle}>
                            <View style={thumbnailContainerStyle}>
                                <Image
                                    style={thumbnailStyle}
                                    source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnfIoLjz9xXqUw0rc63-z9z_vBxNJUR9u_JkJwf6PxO_5QnDgkAQ' }}
                                />
                            </View>
                            <View style={descriptionContainerStyle}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={titleStyle}>{this.props.title}</Text>
                                    <Text style={priceStyle}>${this.props.price}</Text>
                                </View>

                                <Text style={conditionStyle}>Condition: {this.props.condition}</Text>

                                <Text style={descriptionStyle}>{this.props.description}</Text>

                            </View>
                        </View>


                        <View style={bottomSectionStyles}>
                            <Text style={ratingStyle}>Rating: &#9733;&#9733;&#9733;</Text>
                            <Text style={likeSymbolStyle}>&#9829;</Text>
                        </View>
                    </Card>
                </View>
            </TouchableWithoutFeedback>
        );
    }

};

const styles = {
    bottomSectionStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center'
    },

    likeSymbolStyle: {
        fontSize: 25,
        color: 'red'
    },

    ratingStyle: {
        fontSize: 18
    },


    thumbnailStyle: {
        height: 50,
        width: 50
    },

    thumbnailContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        margin: 5,

    },

    postDetailContainerStyle: {
        flexDirection: 'row',
        flex: 1
    },

    descriptionContainerStyle: {
        flex: 5,
        margin: 5
    },

    titleStyle: {
        flex: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },

    priceStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 3,
        textAlign: 'right'
    },

    conditionStyle: {
        fontSize: 16,
        marginTop: 5
    },

    descriptionStyle: {
        fontSize: 16,
        marginTop: 5
    }

};

export { Post };
