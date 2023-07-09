import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	updateProfile,
} from 'firebase/auth';
import {
	getFirestore,
	collection,
	addDoc,
	doc,
	setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyALDCoADNu5RgLmwuq2GXq5H07iwBQtzP8',
	authDomain: 'estagio-masters.firebaseapp.com',
	databaseURL: 'https://estagio-masters-default-rtdb.firebaseio.com',
	projectId: 'estagio-masters',
	storageBucket: 'estagio-masters.appspot.com',
	messagingSenderId: '422267934459',
	appId: '1:422267934459:web:fa313d57284bb4b319425e',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
	app,
	auth,
	db,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	addDoc,
	updateProfile,
	doc,
	setDoc,
	collection,
};
