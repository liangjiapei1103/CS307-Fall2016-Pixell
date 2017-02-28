import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Textarea = ({ value, onChangeText, placeholder, secureTextEntry, multiline }) => {
    const { inputStyle, labelStyle, containerStyle } = styles;

    return (
        <View style={containerStyle}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={inputStyle}
                multiline={multiline}
                underlineColorAndroid='rgba(0,0,0,0)'
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        color: '#000',
        paddingTop: 5,
        paddingLeft: 20,
        fontSize: 18,
        lineHeight: 18,
        flex: 1
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1,
        marginBottom: 10
    },
    containerStyle: {
        height: 100,
        width: 300,
        flex: 1,
        alignItems: 'flex-start',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray'
    }
}

export { Textarea };
