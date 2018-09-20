import React, {Component} from 'react';
import {ScrollView, View, Text, FlatList, Modal, StyleSheet, Alert, PanResponder, Share} from 'react-native';
import {Card, Icon, Rating, Input, Button} from 'react-native-elements';
import {baseUrl} from '../shared/baseUrl';
import {connect} from 'react-redux';
import {postFavorite, postComment} from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        if (dx  < -200) {
            return true;
        }
        else {
            return false;
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add '+ dish.name + 'to your favorites?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => props.favorite? alert('Already Favorite'): props.onHeartPress()}
                    ],
                    {cancelable: false}
                )
            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        })
    }
    if (dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={1500} {...panResponder.panHandlers}
                ref={this.handleViewRef}>
                <Card featuredTitle={dish.name} image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text> 
                    <View style={styles.row}>
                        <Icon raised reverse name={props.favorite? 'heart' : 'heart-o'} type='font-awesome' color='#f50' 
                            onPress={() =>props.favorite? alert('Already Favorite') : props.onHeartPress()}/>
                        <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8' onPress={() => props.onPencilPress()}/>
                        
                        <Icon raised reverse name='share' type='font-awesome' color='#51D2A8' onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}/>
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(
            <View></View>
        );
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item,index}) => {
        return(
            <View key={index} style={{margin:15}}>
                <Text style={{fontSize: 14}}>
                    {item.comment}
                </Text>
                <View>    
                    <Rating imageSize={15} readonly startingValue={item.rating} style={{paddingVertical: 10}}/>
                </View>
                <Text style={{fontSize: 12}}>
                    {'-- ' + item.author + ', ' + item.date }
                </Text>
            </View>
        )
    }
    return(
        <Animatable.View animation="fadeInUp" duration={1500}>

            <Card title='Comments'>
                <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id}/>
            </Card>
        </Animatable.View>
    )
}

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            author: '',
            comment: '',
            rating: 3,
            id: parseInt(this.props.navigation.getParam('dishId'))
        }
    }
    ratingCompleted(rating) {
        console.log(rating);
    }
    handleRate(rate) {
        this.setState({
            rating: rate
        })
    }
    resetForm() {
        this.setState({
            rating: 3,
            author: '',
            comment: '',
        })
    }
    
    handleSubmit() {
        this.props.postComment(this.state.id, this.state.rating, this.state.author, this.state.comment)
        this.toggleModal();
        this.resetForm();
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        
        return(
        <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el === dishId)}
                onHeartPress={()=> this.props.postFavorite(dishId)} onPencilPress = {() => this.toggleModal()}/>
            <RenderComments comments={this.props.comments.comments.filter((comment)=> comment.dishId === dishId)} />
        
            <Modal animationType='slide' transparent={false} visible={this.state.showModal}
                onRequestClose={() => {this.toggleModal()}} onDismiss={() => {this.toggleModal()}}>
                <View style={styles.modal}>
                    <View style={styles.row}>
                        <Rating showRating type="star" fractions={0} startingValue={3} imageSize={40} onFinishRating={(value) => this.handleRate(value)} style={{ paddingVertical: 10 }}/>
                    </View>

                    <View style={{marginTop: 10}}>
                        <Input value={this.state.author} onChangeText={(text) => this.setState({author: text})}
                            placeholder='Author' leftIcon={<Icon name='user-o' type='font-awesome'/>}/>
                    </View>
                    <View style={{marginVertical:10}}>
                        <Input value={this.state.comment} onChangeText={(text) => this.setState({comment: text})}
                            placeholder='Comment' leftIcon={<Icon name='comment-o' type='font-awesome'/>} multiline={true} numberOfLines={4}/>
                    </View>
                    <View style={{marginVertical: 10}}>
                        <Button title='Submit' buttonStyle={{backgroundColor: '#512DA8', borderRadius: 5}} iconRight icon={<Icon name='direction' type='entypo' color='white' size={18}/>}
                            onPress = {()=> this.handleSubmit()}/>
                    </View>
                    <Button title='Cancel' buttonStyle={{backgroundColor: '#808080', borderRadius: 5}} iconRight icon={<Icon name='close' type='font-awesome' color='white' size={18}/>}
                        onPress={()=>{this.toggleModal(); this.resetForm()}}/>
                </View>
            </Modal>

        </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 20,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row', 
        justifyContent:'center', 
        alignItems:'center'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);