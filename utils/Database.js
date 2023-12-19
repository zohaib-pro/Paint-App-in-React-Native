import AsyncStorage from "@react-native-async-storage/async-storage";
import {firebase} from '../config'
import FirebaseHelper from "./FirebaseHelper";

class Database {

    
    static async backup(drawings) {
        const firebaseHelper = new FirebaseHelper()
        const user = await this.getSignedInUser();
        console.log(user.uid)
        await firebaseHelper.setItem('drawings', ''+user.uid, {drawings: drawings})
    }

    static async saveDrawing (drawing, userEmail = "test@gmail.com") {
        const drawings = await this.getDrawings();
        const drawingExist = drawings.filter(item=>item.title === drawing.title)
        
        if (drawingExist.length > 0) {
            const prevDrawing = drawingExist[0]
            prevDrawing.drawingImage = drawing.drawingImage
            prevDrawing.sketchImage = drawing.sketchImage
        }else{
            drawings.push({...drawing,  userEmail})
        }
        
        this.saveDrawings(drawings)
    }

    static async saveDrawings(drawings) {
        AsyncStorage.setItem("drawings", JSON.stringify(drawings))
    }

    static async getOnlineDrawings (uid, onSuccess=null) {
        // const firestore = firebase.firestore()
        // console.log("online drawings ->"+uid)
        // const drawings = await firestore.collection('drawings').doc(uid).get()
        // console.log(drawings.data())
        // if (drawings && onSuccess)
        //     onSuccess(drawings.drawings)
        // if (drawings)
        //     return drawings.drawings;
        return []
    }

    static async getDrawings ( onSuccess) {
        const drawings = await AsyncStorage.getItem("drawings");
        const data = JSON.parse(drawings) || [];
        if (onSuccess)
            onSuccess(data)
        return data;
    }

    static async deleteDrawings (idList) {
        if (!idList) {
            await AsyncStorage.removeItem('drawings')
            return;
        }
        const drawings = await this.getDrawings()
        const filteredDrawings = drawings.filter(item=>!idList.includes(item.title))
        console.log(filteredDrawings.map(item=>item.title))
        await this.saveDrawings(filteredDrawings)
    }

    static async _getUsers() {
        const users = await AsyncStorage.getItem("users");
        return JSON.parse(users) || [];
    }

    static async _setUsers(users) {
        AsyncStorage.setItem("users", JSON.stringify(users));
    }

    static _findUser(users, username) {
        return users.find(user => user.username == username);
    }

    static async addUser(newUser, onComplete) {
        try {
            
            const users = await this._getUsers();
            const user = this._findUser(users, newUser.username);
            if (user){
                onComplete("User already exists!"+user)
                return;
            }

            users.push(newUser); 

            // Store the updated user array in AsyncStorage
            await this._setUsers(users);
            onComplete("ok");
        } catch (error) {
            onComplete("Failed to register!"+error.message);
        }
    }

    static async signinUser(userInfo) {
        await AsyncStorage.setItem("signedInUser", JSON.stringify(userInfo));
    }

    static async getSignedInUser(onComplete) {
        const signedInUser = await AsyncStorage.getItem("signedInUser");
        const user = JSON.parse(signedInUser) || null;
        if (onComplete)
            onComplete(user);
        return user;
    }

    static async signout(onComplete) {
        await AsyncStorage.removeItem("signedInUser");
        onComplete();
    }

    static async saveUserInfo(userInfo) {
        var users = await this._getUsers();
        users = users.filter(u=> u.username != userInfo.username)
        users.push(userInfo);
        await AsyncStorage.setItem("signedInUser", JSON.stringify(userInfo));
        this._setUsers(users);
    }

    static async setSynced(onSuccess) {
        await AsyncStorage.setItem("syncDrawings", JSON.stringify(userInfo))
        if (onSuccess)
            onSuccess()
    }

    static async isSynced(onSuccess) {
        const result = await AsyncStorage.getItem("syncDrawings", JSON.stringify(userInfo))
        if (onSuccess)
            onSuccess(result)
        return result;
    }
}


export default Database;
