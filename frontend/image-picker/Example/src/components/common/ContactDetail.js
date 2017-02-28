import React, { Component } from 'react';
import { Image, Text, View, Linking, TouchableOpacity } from 'react-native';
import { ConSection, Button } from './';
import { Card, CardItem } from 'native-base';

class ContactDetail extends Component {

    render() {

        const { username, message, avatarUrl} = this.props.contact;
        const {
            thumbnailStyle,
            headerContentStyle,
            thumbnailContainerStyle,
            headerTextStyle
        } = styles;

        return (
            <Card>
                <CardItem style={{flexDirection: 'row', padding: 5}}
                          onPress={() => {
                              this.props.hideTabbar();
                              this.props.beginChatting(this.props.contact);
                          }}
                >
                    <View style={thumbnailContainerStyle}>
                            {/*<TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>*/}
                            <Image
                                style={thumbnailStyle}
                                source={{ uri: avatarUrl }}
                            />
                           {/*} </TouchableOpacity>*/}
                    </View>

                    <View style={headerContentStyle}

                    >
                            <Text style={headerTextStyle}>{username}</Text>
                            <Text style={{marginLeft: 5}}>{message}</Text>
                    </View>
                </CardItem>
            </Card>
        );
    }
};

const styles = {
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 18,
        marginBottom: 2,
        color: '#616161',
        marginLeft: 5
    },
    thumbnailStyle: {
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#AED6F1',
        width: 60
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    imageStyle: {
        height: 300,
        flex: 1
    }
};

export { ContactDetail };
