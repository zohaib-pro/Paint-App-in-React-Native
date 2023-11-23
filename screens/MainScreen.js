import { FlatList } from "react-native-gesture-handler";
import styles from "../utils/styles";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Database from "../utils/Database";

export default function MainScreen({ navigation, route }) {

    const userInfo = route.params;
    console.log(route.params);

    const [drawings, setDrawings] = useState([
        {key: 1, title: "Drawing 1", path: "coming soon1"},
        {key: 2, title: "Drawing 2", path: "coming soon2"},
        {key: 3, title: "Drawing 3", path: "coming soon3"},
        {key: 4, title: "Drawing 4", path: "coming soon4"},
    ])

    const handleNewPress = ()=>{
        const id = drawings.length +1;
        const newDrawings = [...drawings, {key: id, title: "Drawing 4", path: "coming soon4"}];
        setDrawings(newDrawings)
    }

    const handleSignout = () =>{
        Database.signout(()=>{
            navigation.replace('Login')
        });
    }

    return (
        <View style={[styles.container, styles.topbarSpace]}>
            <View style={[styles.horizontal, styles.justifyCenter, {margin: 10}]}>
            <TouchableOpacity
            style={[{}]}
            onPress={()=>{handleNewPress()}}>
                <Text style={{fontSize: 30}}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.center]}
            onPress={()=>{handleSignout()}}>
                <Text style={[styles.center, {fontSize: 20, textDecorationLine: 'underline'}]}>signout</Text>
            </TouchableOpacity>
            </View>
            <FlatList 
                keyExtractor={item=>item.key.toString()}
                data={drawings}
                renderItem={({item})=>(
                    <TouchableOpacity style={[styles.card, styles.center, {minHeight: 100}]}
                        onPress={()=>{navigation.navigate('Canvas', userInfo)}}>
                        <Text style={{color: 'black'}}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}