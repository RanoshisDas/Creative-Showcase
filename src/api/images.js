import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, db } from "../firebase";

// Upload image
export async function uploadImage(file, title, user) {
    const imageRef = ref(storage, `images/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "images"), {
        userId: user.uid,
        userName: user.username,
        title,
        imageUrl,
        createdAt: serverTimestamp(),
    });

    return imageUrl;
}

// Get all images
export async function getAllImages() {
    const snapshot = await getDocs(collection(db, "images"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get images of a user
export async function getUserImages(userId) {
    const q = query(collection(db, "images"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getImageByUserName(UserName) {
    const q = query(collection(db, "images"), where("userName", "==", UserName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
// Delete image
export async function deleteImage(imageId, imageUrl) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    await deleteDoc(doc(db, "images", imageId));
}
