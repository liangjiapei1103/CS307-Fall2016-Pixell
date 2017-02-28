import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Tabs from 'react-native-tabs';

class Tabbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
                  selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
                <Text name="Message" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Message</Text>
                <Text name="Market" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Market</Text>
                <Text name="Profile" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Profile</Text>
            </Tabs>
        );
    }
}

export { Tabbar };
