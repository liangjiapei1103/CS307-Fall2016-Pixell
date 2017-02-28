import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from '../common';
import { Button as NButton, Icon, Container, Content, Header, Title } from 'native-base';
import axios from 'axios';

class LoginForm extends Component {

    state = { email: '', password: '', confirm_password:'', error: '', loading: false, signUp: false, login: true, forget: false };

    renderLogin() {
        console.log("render login");
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.titleStyle}>Pixell</Text>
                <Card>
                    <CardSection>
                        <Input
                            placeholder="user@purdue.edu"
                            label="Email"
                            value={this.state.email}
                            onChangeText={(email) => {
                                this.setState({ email });
                                if (!email.includes('@purdue.edu')) {
                                    this.setState({error: 'You must use a purdue email.'})
                                } else {
                                    this.setState({error: ''})
                                }
                            }}
                        />
                    </CardSection>

                    <CardSection>
                        <Input
                            placeholder="password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={(password) => {
                                this.setState({ password });
                                if (password.length < 8) {
                                    this.setState({error: 'Password should be at least 8 digits'})
                                } else {
                                    this.setState({error: ''})
                                }

                            }}
                            secureTextEntry
                        />
                    </CardSection>

                    <Text style={styles.errorTextStyle}>
                        {this.state.error}
                    </Text>

                    <CardSection>
                        {this.renderLoginButton()}
                        {this.renderSignupButton()}
                    </CardSection>

                    <CardSection>
                        {this.renderForgetPasswordButton()}
                    </CardSection>
                </Card>
            </View>
        );
    }

    renderSignUp() {
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.titleStyle}>Sign Up</Text>
                <Card>
                    <CardSection>
                        <Input
                            placeholder="user@purdue.edu"
                            label="Email"
                            value={this.state.email}
                            onChangeText={(email) => {
                                this.setState({ email });
                                if (!email.includes('@purdue.edu')) {
                                    this.setState({error: 'You must use a purdue email.'})
                                } else {
                                    this.setState({error: ''})
                                }
                            }}
                        />
                    </CardSection>

                    <CardSection>
                        <Input
                            placeholder="password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={(password) => {
                                this.setState({ password });
                                if (password.length < 8) {
                                    this.setState({error: 'Password should be at least 8 digits'})
                                } else {
                                    this.setState({error: ''})
                                }

                            }}
                            secureTextEntry
                        />
                    </CardSection>

                    <CardSection>
                        <Input
                            placeholder="Confirm password"
                            label="Confirm Password"
                            value={this.state.confirm_password}
                            onChangeText={(confirm_password) => {
                                this.setState({ confirm_password });
                                if (confirm_password != this.state.password) {
                                    this.setState({error: 'Password should be matched'})
                                } else {
                                    this.setState({error: ''})
                                }
                            }}
                            secureTextEntry
                        />
                    </CardSection>

                    <Text style={styles.errorTextStyle}>
                        {this.state.error}
                    </Text>

                    <CardSection>
                        {this.renderLoginButton()}
                        {this.renderSignupButton()}
                    </CardSection>
                </Card>
            </View>
        );
    }

    renderForget() {
      return (
          <Container>
              <Header>
                  <NButton transparent onPress={() => {
                          this.setState({ login: true, signUp: false, forget: false, error: '' });
                      }}>
                      <Icon name='ios-arrow-back' />
                  </NButton>
                  <Title>Reset Password</Title>
              </Header>
              <Content>
                  <Card>
                      <CardSection>
                          <Input
                              placeholder="user@purdue.edu"
                              label="Email"
                              value={this.state.email}
                              onChangeText={(email) => {
                                  this.setState({ email });
                                  if (!email.includes('@purdue.edu')) {
                                      this.setState({error: 'You must use a purdue email.'})
                                  } else {
                                      this.setState({error: ''})
                                  }
                              }}
                          />
                      </CardSection>

                      <Text style={styles.errorTextStyle}>
                          {this.state.error}
                      </Text>

                      <CardSection>
                          {this.renderForgetPasswordButton()}
                      </CardSection>
                  </Card>
              </Content>
          </Container>
      );
    }

    renderLoginOrSignUp() {
        console.log(this.state);

        if (this.state.login) {
            return this.renderLogin();
        } else if (this.state.signUp){
            return this.renderSignUp();
        } else if (this.state.forget) {
            return this.renderForget();
        }
    }

    onLoginPress() {

        if (!this.state.login) {
            this.setState({ login: true, signUp: false, forget: false, error: '' });
        } else {

            if (this.state.error != '') {
                this.setState({error: 'Login requirement not met'})
            } else {
                const { email, password } = this.state;

                this.setState({ error: '', loading: true })

                if ( email == '' ) {
                    this.setState({
                        error: 'Email cannot be empty.',
                        loading: false
                    });
                } else if ( password == '') {
                    this.setState({
                        error: 'Password cannot be empty.',
                        loading: false
                    });
                } else {
                    axios.post('https://purdue-pixell.herokuapp.com/api/login', {
                        email: email,
                        password: password
                    })
                    .then((response) => {
                        if (response.data._id) {
                            console.log("Success");
                            console.log(response);
                            this.onLoginSuccess(response.data);
                            console.log("onLoginSuccess");
                            // this.props.navigator.push(this.props.routes[1]);
                            console.log("go to app page");
                        } else {
                            console.log("Error");
                            console.log(this.state);
                            this.setState({
                                error: 'Authentication Failed.',
                                loading: false
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.onLoginFail();
                    });
                }
            }
        }
    }

    onForgetPasswordPress() {
        // this.props.navigator.push(this.props.routes[2]);
        if(!this.state.forget) {
            this.setState({ login: false, signUp: false, forget: true, error: ''});
        } else {
            if (this.state.error != '') {
                this.setState({error: 'Send Confirmation requirement not met'})
            } else {
                const { email } = this.state;

                this.setState({ error: '', loading: true })
                if ( email == '' ) {
                    this.setState({
                        error: 'Email cannot be empty.',
                        loading: false
                    });
                } else {
                    axios.post('http://purdue-pixell.herokuapp.com/forget', {
                        email: email
                    })
                    .then((response) => {
                      console.log(response);
                        if (response.data.toLowerCase() === 'send success') {
                            console.log("Success");
                            this.setState({
                                error: 'Mail Sent.',
                                loading: false
                            });
                        } else {
                            console.log("Error");
                            this.setState({
                                error: 'User not found.',
                                loading: false
                            });
                        }
                    })
                }
            }
        }
    }



    onLoginFail() {
        console.log(this.state);
        this.setState({
            error: 'Authentication Failed.',
            loading: false
        });
    }

    onLoginSuccess(user) {
        // console.log(this.props.login());
        this.setState({
            loading: false,
            email: '',
            password: '',
            error: ''
        });

        this.props.login(user);
    }

    onSignUpPress() {

        if (!this.state.signUp) {
            this.setState({ login: false, signUp: true, forget:false, error: '' });
        } else {

            if (this.state.error != '') {
                this.setState({error: 'Sign up requirment not met'})
            } else {
                const { email, password, confirm_password } = this.state;

                this.setState({ error: '', loading: true })

                if ( email == '' ) {
                    this.setState({
                        error: 'Email cannot be empty.',
                        loading: false
                    });
                } else if ( password == '') {
                    this.setState({
                        error: 'Password cannot be empty.',
                        loading: false
                    });
                } else if ( confirm_password == '') {
                    this.setState({
                        error: 'Confirm Password cannot be empty.',
                        loading: false
                    });
                } else {
                    axios.post('https://purdue-pixell.herokuapp.com/api/signup', {
                        email: email,
                        password: password,
                        confirm_password: confirm_password
                    })
                    .then((response) => {
                        console.log(response);
                        if (response.data._id) {
                            console.log("Success");
                            console.log(response);
                            this.onSignUpSuccess(response.data);
                            // this.props.navigator.push(this.props.routes[1]);
                        } else {
                            console.log("Error");
                            console.log(this.state);
                            this.setState({
                                error: 'Authentication Failed.',
                                loading: false
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.onSignUpFail();
                    });
                }
            }
        }
    }

    onSignUpFail() {
        console.log(this.state);
        this.setState({
            error: 'Authentication Failed.',
            loading: false
        });
    }

    onSignUpSuccess(user) {
        this.setState({
            loading: false,
            email: '',
            password: '',
            error: '',
            confirm_password: ''
        });

        this.props.signup(user);
    }

    renderLoginButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button onPress={this.onLoginPress.bind(this)}>
                Log in
            </Button>
        );
    }

    renderSignupButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button onPress={this.onSignUpPress.bind(this)}>
                Sign Up
            </Button>
        );
    }

    renderForgetPasswordButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }
        if (this.state.login) {
            return (
                <Button onPress={this.onForgetPasswordPress.bind(this)}>
                    Forget Password
                </Button>
            );
        } else if (this.state.forget) {
          return (
              <Button onPress={this.onForgetPasswordPress.bind(this)}>
                  Send Reset Email
              </Button>
          );
        }
    }

    render() {
        return (
            this.renderLoginOrSignUp()
        );
    }
};

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    titleStyle: {
        fontSize: 20,
        alignSelf: 'center'
    },
    containerStyle: {
        paddingTop: 20,
    }
};

export { LoginForm };
