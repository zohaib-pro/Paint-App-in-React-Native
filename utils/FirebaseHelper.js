import {firebase, auth} from '../config'
import { getFirestore, collection, query, onSnapshot, getDocs, getDoc, doc, setDoc, addDoc } from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

class FirebaseHelper{
    constructor(){
        this.firestore = getFirestore(firebase)
    }


    async signUp(email, password, name){
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        console.log('user created: '+uid);
        // Add user information to Firestore
        await this.setItem('users', uid, {email, name})
    }


    async signIn(email, password){
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user 
        return user
    }

    async getItems(collectionName){
        const itemCollection = collection(this.firestore, collectionName)
        const itemSnapshot = await getDocs(itemCollection)
        const itemList = itemSnapshot.docs.map(doc => doc.data())
        return itemList
    }

    async getItem(collectionName, docName){
        const itemDocRef = doc(this.firestore, collectionName, docName)
        const itemSnapshot = await getDoc(itemDocRef)
        const item = itemSnapshot.data()
        return item
    }

    async setItem(collectionName, docName, value) {
        const itemDocRef = doc(this.firestore, collectionName, docName)
        await setDoc(itemDocRef, value)
    }
    
}

export default FirebaseHelper;