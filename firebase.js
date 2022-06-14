import firebase from "firebase/compat/app"
import "firebase/compat/storage"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBtYDPHQMvTpH1nXwdmgof_Eo7IAw5H4hA",
    authDomain: "facebook-f3e52.firebaseapp.com",
    projectId: "facebook-f3e52",
    storageBucket: "facebook-f3e52.appspot.com",
    messagingSenderId: "758478774589",
    appId: "1:758478774589:web:6082d3e9691587af682554"
};

// kapag merong existing app, initialize mo yun else use that
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
const db = app.firestore() // firestore gagamitin natin
const storage = firebase.storage()

export { db, storage }