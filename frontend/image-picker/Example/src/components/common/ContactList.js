import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import axios from 'axios';
import { ContactDetail, Card } from './';



class ContactList extends Component {
    state = {
        // contacts: [
        //     {userName:"Gustavo",message:"How are you dude",avatar:"https://www.cs.purdue.edu/homes/grr/grr.jpg"},
        //     {userName:"Dusmore",message:"Ready to demo? Ready to demo?",avatar:"https://www.cs.purdue.edu/people/images/faculty/bxd.jpg"}
        // ]
        contacts: this.props.contacts
    };

    componentWillMount() {
        axios.get(`https://purdue-pixell.herokuapp.com/api/user/${this.props.userid}/chattingwith`)
            .then((response) => {
                console.log('Get chattingWith array: ', response.data);
                this.props.updateContacts(response.data);
            });
    }

    renderContantList() {
        console.log("contacts: ", this.props.contacts);
        return this.props.contacts.map((contact) => {
            if (contact.username && (contact.username.toUpperCase().includes(this.props.keyword.toUpperCase())))
            {
                return <ContactDetail key={contact.username} contact={contact}
                                      beginChatting={this.props.beginChatting}
                                      hideTabbar={this.props.hideTabbar}
                       />
            }
        }

        );
    }

    render() {
        return (
            <View>
                {this.renderContantList()}
            </View>
        );
    }
}

export { ContactList };
