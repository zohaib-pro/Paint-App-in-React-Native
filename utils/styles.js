import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    horizontal: {
        flexDirection: 'row'
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    flexEnd: {
        justifyContent: 'flex-end'
    },

    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
    }, 

    fullscreen: {
        width: '100%',
        height: '100%'
    },

    red: {
        backgroundColor: 'red'
    },

    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10, 
        width: '100%',
        marginVertical: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 50,
        shadowColor: '#171717'
      },
});

export default styles;