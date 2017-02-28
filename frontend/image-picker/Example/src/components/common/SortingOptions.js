import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Header, Title, Button, Icon, InputGroup, Input, Content, List, ListItem, Picker, Item, Radio, Text } from 'native-base';
import axios from 'axios';

class SortingOptions extends Component {

    state = {
        options: this.props.options
    }

    render() {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => {
                            this.props.cancelChoosingSortingOption();
                            this.props.showTabbar();
                        }}>
                        <Icon name='ios-arrow-back' />
                    </Button>

                    <Title>Sorting Options</Title>

                    <Button transparent onPress={() => {
                        this.props.getPostsWithSortingOption(this.props.options);
                        this.props.cancelChoosingSortingOption();
                        this.props.showTabbar();
                    }}>
                        <Icon name='md-checkmark' />
                    </Button>
                </Header>
                <Content>
                    <Container>
                <Content>
                    <List>
                        <ListItem onPress={() => {
                            this.props.selectTimeNewToOld();
                        }}>
                            <Radio selected={this.props.options.timeNewToOld} onPress={() => {
                                console.log("You want to sort by time from new to old.");
                                this.props.selectTimeNewToOld();
                            }}/>
                            <Text>Time: New to Old</Text>
                        </ListItem>
                        <ListItem onPress={() => {
                            console.log("You want to sort by time from old to new.");
                            this.props.selectTimeOldToNew();
                        }}>
                            <Radio selected={this.props.options.timeOldToNew} onPress={() => {
                                console.log("You want to sort by time from old to new.");
                                this.props.selectTimeOldToNew();
                            }}/>
                            <Text>Time: Old to New</Text>
                        </ListItem>
                        <ListItem onPress={() => {
                            console.log("You want to sort by price from low to high.");
                            this.props.selectPriceLowToHigh();
                        }}>
                            <Radio selected={this.props.options.priceLowToHigh} onPress={() => {
                                console.log("You want to sort by price from low to high.");
                                this.props.selectPriceLowToHigh();
                            }}/>
                            <Text>Price: Low to High</Text>
                        </ListItem>
                        <ListItem onPress={() => {
                            console.log("You want to sort by price from high to low.")
                            this.props.selectPriceHighToLow();
                        }}>
                            <Radio selected={this.props.options.priceHighToLow} onPress={() => {
                                console.log("You want to sort by price from high to low.")
                                this.props.selectPriceHighToLow();
                            }}/>
                            <Text>Price: High to Low</Text>
                        </ListItem>
                        <ListItem onPress={() => {
                            console.log("You want to sort by rating from low to high.")
                            this.props.selectRatingLowToHigh();
                        }}>
                            <Radio selected={this.props.options.ratingLowToHigh} onPress={() => {
                                console.log("You want to sort by rating from low to high.")
                                this.props.selectRatingLowToHigh();
                            }}/>
                            <Text>Rating: Low to High</Text>
                        </ListItem>
                        <ListItem onPress={() => {
                            console.log("You want to sort by rating from high to low.")
                            this.props.selectRatingHighToLow();
                        }}>
                            <Radio selected={this.props.options.ratingHighToLow} onPress={() => {
                                console.log("You want to sort by rating from high to low.")
                                this.props.selectRatingHighToLow();
                            }}/>
                        <Text>Rating: High to Low</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
                </Content>
            </Container>
        );
    }


}

export { SortingOptions };
