import db from '../lib/firebase';
import { doc, getDoc,collection,getDocs,updateDoc} from 'firebase/firestore';

export class User {
    constructor(uid, userType, firstName, lastName, email) {
        this.uid = uid;
        this.userType = userType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}

/*
    Function that takes in uid (which is accessible through firebase's onAuthStateChanged) and userType (which is passed as props to the sidebar component), fetches data for that user and returns a User object
*/
export async function createUser(uid, userType) {
    const userData = await getUserData(uid, userType);
    return new User(userData.uid, userData.userType, userData.firstName, userData.lastName, userData.email);
}

// Function that returns a studentDoc snapshot from the database
export async function getStudentDoc(uid){
    const studentDoc = doc(db, 'students', uid);
    const studentSnapshot = await getDoc(studentDoc);
    return studentSnapshot;
}

export async function getStudentDocs(){
    const studentCollection = collection(db, 'students');
    const studentDocs = await getDocs(studentCollection);
    return studentDocs;
}


// Function that returns a studentDoc snapshot from the database
export async function getTeacherDoc(uid){
    const teacherDoc = doc(db, 'teachers', uid);
    const teacherSnapshot = await getDoc(teacherDoc);
    return teacherSnapshot;
}

export async function updateStudentSubmittedAssignments(courseDocRef,updatedSubmittedAssignments){
    await updateDoc(courseDocRef, { submittedAssignments: updatedSubmittedAssignments });

}

// Function that connects to the database and fetches the user data
async function getUserData(uid, userType) {
    try {
        let collectionName;

        // Note that types 'Student' and 'Teacher' are capitalized, but admin is not. 
        if (userType === 'Student') {
            collectionName = 'students';
        } else if (userType === 'Teacher') {
            collectionName = 'teachers';
        } else if (userType === 'admin') {
            collectionName = 'admins';
        } else {
            throw new Error('Invalid userType');
        }  
        const userDocRef = doc(db, collectionName, uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) 
            throw new Error('User not found');
        return userDocSnapshot.data();
            
    } catch (error) {
        throw error;
    }
}