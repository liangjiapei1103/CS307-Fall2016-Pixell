// Import libraries for making a Component
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

// Make a Component
const Header = (props) => {
    const { textStyle, viewStyle, rightButtonTextStyle } = styles;

    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{ props.headerText }</Text>
            <TouchableOpacity >
                <Text style={rightButtonTextStyle}>{ props.rightButton }</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    textStyle: {
        fontSize: 20
    },
    rightButtonTextStyle: {
        fontSize: 18,
        color: '#007aff',
        alignSelf: 'flex-end'
    }
};

// Make the component available to other parts of the app
export { Header };
