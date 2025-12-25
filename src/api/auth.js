import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    doc,
    query,
    collection,
    where,
    getDocs,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

/* -----------------------------
   Cache Helpers
--------------------------------*/

const CACHE_KEY = "cachedUser";

function cacheUser(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function getCachedUser() {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
}

function clearUserCache() {
    localStorage.removeItem(CACHE_KEY);
}

/* -----------------------------
   Register New User
--------------------------------*/

export async function registerUser(username, email, password) {
    // 1️⃣ Check if username already exists
    const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
    );

    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
        throw new Error("Username already taken");
    }

    // 2️⃣ Create Firebase Auth user
    const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const userData = {
        uid: user.uid,
        username,
        email,
        createdAt: serverTimestamp(),
    };

    // 3️⃣ Save user profile
    await setDoc(doc(db, "users", user.uid), userData);

    // 4️⃣ Cache user data
    cacheUser({
        uid: user.uid,
        username,
        email,
    });

    return user;
}

/* -----------------------------
   Login Existing User
--------------------------------*/

export async function loginUser(email, password) {
    const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    // Fetch user profile from Firestore
    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
        cacheUser({
            uid: user.uid,
            ...snap.data(),
        });
    }

    return user;
}

/* -----------------------------
   Logout
--------------------------------*/

export async function logoutUser() {
    await auth.signOut();
    clearUserCache();
}
