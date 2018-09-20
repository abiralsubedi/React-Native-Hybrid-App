import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {Icon, Input, CheckBox, Button} from 'react-native-elements';
import {SecureStore, Permissions, ImagePicker} from 'expo';
import {createBottomTabNavigator} from 'react-navigation';
import {baseUrl} from '../shared/baseUrl';

class Login extends Component {
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

    static navigationOptions = {
        title: 'Login',
        
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
                    <Button onPress={()=> this.props.navigation.navigate('Register')} title='Register' clear titleStyle={{color: 'blue'}}
                        icon={<Icon name='user-plus' type='font-awesome' size={24} color='blue'/>}/>
                </View>
            </View>
        );
    }
}

// class RegisterTab extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             username: '',
//             password: '',
//             firstname: '',
//             lastname: '',
//             email: '',
//             remember: false,
//             imageUrl: baseUrl + 'images/logo.png'
//         }
//     }

//     static navigationOptions = {
//         title: 'Register',
        
//     };

//     handleRegister() {
//         console.log(JSON.stringify(this.state));
//         if (this.state.remember)
//             SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
//                 .catch((error) => console.log('Could not save user info', error));
//     }

//     render() {
//         return(
//             <ScrollView>
//                 <View style={styles.container} >
//                     <Input placeholder='Username' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
//                         onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                
//                     <Input placeholder='Password' leftIcon={{type:'font-awesome', name: 'key'}} containerStyle={styles.formInput}
//                         onChangeText={(password) => this.setState({password})} value={this.state.password}/>

//                     <Input placeholder='First Name' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
//                         onChangeText={(firstname) => this.setState({firstname})} value={this.state.firstname}/>
                    
//                     <Input placeholder='Last Name' leftIcon={{type:'font-awesome', name: 'user-o'}} containerStyle={styles.formInput}
//                         onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname}/>
                    
//                     <Input placeholder='Email' leftIcon={{type:'font-awesome', name: 'envelope-o'}} containerStyle={styles.formInput}
//                         onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                    
//                     <CheckBox title='Remember Me' checked={this.state.remember} center containerStyle={styles.formCheckbox}
//                         onPress={() => this.setState({remember: !this.state.remember})}/>

//                     <View style={styles.formButton}>
//                         <Button onPress={()=> this.handleRegister()} title='Register' buttonStyle={{backgroundColor: '#512DA8'}}
//                             icon={<Icon name='user-plus' type='font-awesome' color='white' size={24}/>}/> 
//                     </View>
//                 </View>
//             </ScrollView>
//         )
//     }
// }

// const LoginTab = createBottomTabNavigator({
//     Login: LoginTab,
//     Register: RegisterTab
// }, {
//     tabBarOptions = {
//         activeBackgroundColor: '#9575CD',
//         inactiveBackgroundColor: '#D1C4E9',
//         activeTintColor: 'white',
//         inactiveTintColor: 'gray'
//     }
// })

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formInput: {
        margin: 20,
    },
    formCheckbox: {
        margin: 40,
        backgroundColor: null
    },
    formButton: {
        margin: 20
    }
})

export default Login;
