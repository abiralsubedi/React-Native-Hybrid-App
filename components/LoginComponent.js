import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Icon, Input, CheckBox, Button, Avatar} from 'react-native-elements';
import {SecureStore, Permissions, ImagePicker, Asset, ImageManipulator} from 'expo';
import {createBottomTabNavigator} from 'react-navigation';
import {baseUrl} from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true});
                }
            })
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch((error) => console.log('Could not save user info', error))
        }
        else {
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error))
        }
    }

    render() {
        return(
            <Animatable.View animation='fadeIn' duration={1500}>
            <View style={styles.container} >
                <Input placeholder='Username' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
                    onChangeText={(username) => this.setState({username})} value={this.state.username}/>
            
                <Input placeholder='Password' leftIcon={{type:'font-awesome', name: 'key'}} containerStyle={styles.formInput}
                    onChangeText={(password) => this.setState({password})} value={this.state.password}/>
            
                <CheckBox title='Remember Me' checked={this.state.remember} center containerStyle={styles.formCheckbox}
                    onPress={() => this.setState({remember: !this.state.remember})}/>

                <View style={styles.formButton}>
                    <Button onPress={()=> this.handleLogin()} title='Login' buttonStyle={{backgroundColor: '#512DA8'}}
                        icon={<Icon name='sign-in' type='font-awesome' size={24} color='white'/>}/> 
                </View>
                <View style={styles.formButton}>
                    <Button onPress={()=> this.props.navigation.navigate('Register')} title='Register' clear titleStyle={{color: '#512DA8'}}
                        icon={<Icon name='user-plus' type='font-awesome' size={24} color='#512DA8'/>}/>
                </View>
            </View>
            </Animatable.View>
        );
    }
}
    class RegisterTab extends Component {
        constructor(props) {
            super(props);
            this.state = {
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                email: '',
                remember: false,
                imageUrl: baseUrl + 'images/logo.png'
            }
        }
        getImageFromCamera = async () => {
            const cameraPermission = await Permissions.askAsync(Permissions.CAMERA)
            const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
                let capturedImage = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [4,4],

                });
                
                if (!capturedImage.cancelled) {
                    this.processImage(capturedImage.uri);
                }
            }

        }

        processImage =  async(imageUri) => {
            let processedImage = await ImageManipulator.manipulate(
                imageUri, 
                [
                    {resize:{width: 400}}
                ],
                {format: 'png'}
            );
            this.setState({imageUrl: processedImage.uri})

        }

        async getImageFromGallery() {
            let selectedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,5]
            });

            this.processImage(selectedImage.uri);
        }
        
        handleRegister() {
            console.log(JSON.stringify(this.state));
            if (this.state.remember) {
                SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                    .catch((error) => console.log('Could not save user info', error));
            }
        }
        render() {
            return(
                <Animatable.View animation='fadeIn' duration={1500}>
                <ScrollView>
                    <View style={styles.container} >
                        <Text style={{fontWeight: 'bold', fontSize:20, color: '#512DA8'}}>
                            Profile Picture:
                        </Text>

                        <View style={styles.imageContainer}>
                            <Avatar rounded size='xlarge' source={{uri: this.state.imageUrl}} containerStyle={{margin: 10}}/>
                            <Button title='Camera' onPress={()=> this.getImageFromCamera()} containerStyle={styles.imageButton}/>
                            <Button title='gallery' onPress= {() => this.getImageFromGallery()} containerStyle={styles.imageButton}/>
                        </View>

                        <Input placeholder='Username' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
                            onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                    
                        <Input placeholder='Password' leftIcon={{type:'font-awesome', name: 'key'}} containerStyle={styles.formInput}
                            onChangeText={(password) => this.setState({password})} value={this.state.password}/>

                        <Input placeholder='First Name' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
                            onChangeText={(firstname) => this.setState({firstname})} value={this.state.firstname}/>
                        
                        <Input placeholder='Last Name' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
                            onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname}/>
                        
                        <Input placeholder='Email' leftIcon={{type:'font-awesome', name: 'envelope-o'}} containerStyle={styles.formInput}
                            onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                        
                        <CheckBox title='Remember Me' checked={this.state.remember} center containerStyle={styles.formCheckbox}
                            onPress={() => this.setState({remember: !this.state.remember})}/>

                        <View style={styles.formButton}>
                            <Button onPress={()=> this.handleRegister()} title='Register' buttonStyle={{backgroundColor: '#512DA8'}}
                                icon={<Icon name='user-plus' type='font-awesome' color='white' size={24}/>}/> 
                        </View>
                    </View>
                </ScrollView>
                </Animatable.View>
            );
        }
    }

    const Login = createBottomTabNavigator({
        Login: {screen: LoginTab,
                navigationOptions: {
                title: 'Login',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='sign-in' type='font-awesome' size={20} color={tintColor} />
                )},
        },

        Register: {screen: RegisterTab,
            navigationOptions: {
                title: 'Register',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Icon name='user-plus' type='font-awesome' size={20} color={tintColor} />
                )},
            }
    }, {
        tabBarOptions: {
            activeBackgroundColor: '#9575CD',
            inactiveBackgroundColor: '#D1C4E9',
            activeTintColor: 'white',
            inactiveTintColor: 'gray',
            style: {
                height: 40
            }
        }
    })

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 10
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10
    },
    formInput: {
        margin: 10,
    },
    formCheckbox: {
        margin: 10,
        backgroundColor: null
    },
    formButton: {
        margin: 20
    },
    imageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    }
})

export default Login;
