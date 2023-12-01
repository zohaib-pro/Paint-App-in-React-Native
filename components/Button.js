import { StyleSheet, View } from "react-native";
import { TouchableOpacity, Text } from "react-native";

const Button = ({title, onPress, style, fontStyle})=> {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.menuButton, style]}
        >
            <Text style={fontStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'lightblue',
        justifyContent: 'center'
    },
})

export default Button;