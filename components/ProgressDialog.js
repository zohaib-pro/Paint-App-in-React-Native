import { StyleSheet, ActivityIndicator, View, Text } from "react-native";

const ProgressDialog = ({ msg }) => {
    return (
        <View style={{ position: 'absolute', flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)' }}>
            <View style={{width: '90%', backgroundColor: 'white', padding: 50, borderRadius: 10}}>
                <ActivityIndicator style={{ color: 'white' }} />
                <Text style={{fontSize: 15, textAlign: 'center'}}>{msg}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default ProgressDialog;