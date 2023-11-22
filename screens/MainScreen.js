import { FlatList } from "react-native-gesture-handler";
import styles from "../utils/styles";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

export default function MainScreen({ navigation }) {

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

    return (
        <View style={[styles.container, styles.topbarSpace]}>
            <TouchableOpacity
            style={[{backgroundColor: 'red', width: 30, alignContent: 'center', alignItems: 'center', right: 0}]}
            onPress={()=>{handleNewPress()}}>
                <Text style={{fontSize: 30}}>+</Text>
            </TouchableOpacity>
            <FlatList 
                keyExtractor={item=>item.key.toString()}
                data={drawings}
                renderItem={({item})=>(
                    <TouchableOpacity style={[styles.card, styles.center, {minHeight: 100}]}
                        onPress={()=>{navigation.navigate('Canvas')}}>
                        <Text style={{color: 'red'}}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}