
import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

interface IState{
   person: {
    name: string,
    age: number
   }
}

type Props = {};
export default class App extends Component < Props, IState > {
    state:IState = {
        person: {
            name: '韩飞',
            age: 22
        }
    }
    render() {
        
        let { name,age } = this.state.person ;
        return ( <View style = { styles.container } >
            <Text style = { styles.welcome } > Welcome {name} to React Native111! </Text> 
            <Text style = { styles.instructions } >age: {age} </Text> 
            <Text style = { styles.instructions } > { instructions } </Text> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
