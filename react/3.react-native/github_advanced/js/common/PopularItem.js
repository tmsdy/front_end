import React, { Component } from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export class PopularItem extends Component {

    render() {
        let {items} = this.props;
        if(!items || !items.owner) return null
        let favoriteIcon = 
            <TouchableOpacity
                style={{padding: 6}}
                onPress={()=>{
                    console.log(1234)
                }}
                underlayColor={'transparent'}
            >
                <FontAwesome 
                    name={'star-o'}
                    size={26}
                    style={{color:'red'}}
                />
            </TouchableOpacity>
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {items.full_name}
                    </Text>
                    <Text style={styles.description}>
                        {items.description}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image style={{height: 22, width: 22}}
                                   source={{uri: items.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Start:</Text>
                            <Text>{items.stargazers_count}</Text>
                        </View>
                        {favoriteIcon}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
  });


export default PopularItem