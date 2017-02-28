import React from 'react';
import { Component} from 'react';
import { Text, View, ScrollView, Image, Linking, TextInput } from 'react-native';
import { Avatar, CardSection, StarRating, Textarea } from './';
import axios from 'axios';
import { Container, Header,Card, Title, Button, Icon, InputGroup, Input, Content} from 'native-base';

class Rating extends Component {
	constructor(props) {
     	super(props);
     	this.state = { 	id: props.id,
                        postid: props.postid,
     					rating: 0,
     					comment: null,
                        user:{}
     					};
 		this._valueChanged = this._valueChanged.bind(this);
    }

    componentWillMount() {
        axios.get(`https://purdue-pixell.herokuapp.com/api/user/${this.state.id}`)
        .then((response) => {
            this.setState({user: response.data})
            console.log("user: ", response.data);
        });
    }
    render() {
    	const { textStyle, pipeStyle, iconStyle, rateStyle, typeStyle, avatarStyle } = styles;
    	console.log("rate:",this.state.rating);
    	console.log("rate:",this.state.comment);
    	return(
    		<View>
	    		<Container>
                <Content>
	    				<Image
                        style={styles.avatarStyle}
                        source={{ uri: this.state.user.avatarUrl }}
                        />
            		{/*render the username email and rating*/}
                    
        			<CardSection>
	    				<Text style={textStyle} >{ this.state.user.username }</Text>
			        </CardSection>
			        <Text style={rateStyle} >Please Rating for  { this.state.user.username }: </Text>
	    			<StarRating
				          maxStars={5}
				          rating={this.state.rating}
				          selectStar={require('./select_star.png')}
				          unSelectStar={require('./unselect_star.png')}
				          valueChanged={this._valueChanged}
				          starSize={30}
          				  interitemSpacing={20}
				     />
				     <CardSection/>
				     <Text style={rateStyle} >Please write a comment: </Text>
				     <CardSection>

                	<TextInput
				        style={{height: 90, width:  300, borderColor: '#D6EAF8', marginLeft:25, borderWidth: 1,borderRadius: 10, fontSize: 16,}}
				        onChangeText={(comment) => this.setState({comment})}
				        value={this.state.comment}
				        multiline={true}
				      />
                	</CardSection>
            		<CardSection>
            			<Button onPress={() => this.submitRate() } style={{width: 320}} >
                    		Submit
                		</Button>
            		</CardSection>
                </Content>
        		</Container>
    		</View>
    	);

    }
  	_valueChanged(rating) {
    	console.log(rating);
    	this.setState({rating: rating});
  	}
    submitRate(){
        axios.post(`https://purdue-pixell.herokuapp.com/rate/${this.state.postid}`,{
            email: this.state.user.email,
            rate: this.state.rating
        })
        .then((response) => {
            console.log("rate a user: ", response.data);
        });
    }

};

const styles = {
	pipeStyle: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
        color: '#85C1E9'
	},
	textStyle: {
        fontSize: 18,
        color: '#707B7C',
        textAlign: 'center',
        marginLeft: 130
    },
    typeStyle: {
        fontSize: 18,
        color: '#707B7C',
        marginBottom: 5,
        alignItems: 'flex-start'
    },
    rateStyle: {
        fontSize: 18,
        color: '#707B7C',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginBottom:5
    },
    iconStyle: {
    	justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor:'#fff',
        marginTop: 30,
        marginBottom: 0,
        borderRadius: 10,
        borderWidth: 3,
        height: 110,
        width: 110,
        borderColor: '#AED6F1'
    },
    avatarStyle: {
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 130,
        borderRadius: 10,
        borderWidth: 2,
        height: 100,
        width: 100,
        borderColor: '#AED6F1'

    }
};

export { Rating };

