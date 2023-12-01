import { StyleSheet } from "react-native";

const primaryColor = '#3c9dd1';
const secondaryColor = '#e8e8e8';

const styles = StyleSheet.create({
    primaryBackground: {
        backgroundColor: primaryColor
    },

    secondaryBackground: {
        backgroundColor: secondaryColor
    },

    container: {
        flex: 1,
    },

    horizontal: {
        flexDirection: 'row'
    },

    justifyCenter: {
        justifyContent: 'space-between'
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    verticalCenter: {
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

    absCenter: {
        width: 512, 
        height: 512,  
        opacity: 0.3

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
        borderRadius: 15,
        padding: 10,
        marginVertical: 10,
        margin: 10

    },

    cardShadow: {
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 50,
        shadowColor: '#171717'
    },

    cardSelected: {
        backgroundColor: '#7fd48f'
    },

    topbarSpace: {
        marginTop: 35
    },
    canvasDefault: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    menuButton: {
        marginTop: 10,
        height: 45,
        padding: 8,
        borderRadius: 5,
        backgroundColor: 'lightblue',
        justifyContent: 'center'
    },
    logo: {
        width: 60,
        height: 60,
   
    },
    modal: {
        height: 400,
        width: 300,
        padding: 10,
        position: 'absolute',
        borderRadius: 10,
        alignItems: 'center'
    },
    prompt: {
        width: 250,
        height: 50,
        backgroundColor: '#e8e8e8',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        borderColor: '#427d9d',
        borderWidth: 1
    },

    primaryTopbar: {
        paddingHorizontal: 25,
        backgroundColor: primaryColor,
        paddingBottom: 10,
        paddingTop: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    }
});

export default styles;