import React from 'react';
import { View } from 'react-native';

const ConSection = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        borderColor: '#D6EAF8',
        position: 'relative'
    }
};

export { ConSection };
