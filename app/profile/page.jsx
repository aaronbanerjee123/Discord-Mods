"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; 
import { updateDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import db from '../lib/firebase';

export default function Profile() {
    const [userInput, setUserInput] = useState({
        email: '',
        firstName: '',
        lastName: '',
        uid: "",
        userType:""
    });
    const [user,setUser] = useState();
    const [userType,setUserType] = useState('user');
    const [isEditing, setIsEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [editedUserInput, setEditedUserInput] = useState({
        email: '',
        firstName: '',
        lastName: '',
        uid: "",
        userType:""
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (auth.currentUser) {
                setUser(auth.currentUser);
                console.log(user);
                console.log(user.uid);
                const stuQuery = query(collection(db, 'students'), where('uid', '==', user.uid));
                const stuSnapshot = await getDocs(stuQuery);

                const teachQuery = query(collection(db, 'teachers'), where('uid', '==', user.uid));
                const teachSnapshot = await getDocs(teachQuery);

                const adminQuery = query(collection(db, 'admins'), where('uid', '==', user.uid));
                const adminSnapshot = await getDocs(adminQuery);

                if (!stuSnapshot.empty) {
                    stuSnapshot.forEach((doc) => {
                        console.log(doc.id, ' => ', doc.data());
                        setUserInput(doc.data());
                    });
                }else if(!teachSnapshot.empty){
                    teachSnapshot.forEach((doc) => {
                        console.log(doc.id, ' => ', doc.data());
                        setUserInput(doc.data());
                    });
                }else if(!adminSnapshot.empty){
                    adminSnapshot.forEach((doc) => {
                        console.log(doc.id, ' => ', doc.data());
                        setUserInput(doc.data());
                    });
                }else {
                    console.log('No such document!');
                }
            } else {
                // User is signed out
                console.log('No user is signed in.');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleEdit = () =>{
        setEditedUserInput({...userInput});
        toggleEditing();
    }

    const handleInputChange = (event) =>{
        setEditedUserInput({...editedUserInput,
            [event.target.name]: event.target.value
        });
    }

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        // console.log("clicked");
        if(userInput.userType === "Student"){
            const stu = query(collection(db, 'students'), where('uid', '==', userInput.uid));
            const stuSnap = await getDocs(stu);
            // console.log("in if condition");
            if(!stuSnap.empty){
                const docRef = stuSnap.docs[0].ref;
                console.log('Updating document:', docRef);
                console.log('With data:', {
                    firstName: editedUserInput.firstName,
                    lastName: editedUserInput.lastName,
                    email: editedUserInput.email,
                });
                await updateDoc(docRef, {
                    firstName: editedUserInput.firstName,
                    lastName: editedUserInput.lastName,
                    email: editedUserInput.email,
                    // Add other fields as needed
                });
            }
        }
        
        if(userInput.userType === "Teacher"){
            const teacher = query(collection(db, 'teachers'), where('uid', '==', userInput.uid));
            const teachSnap = await getDocs(teacher);
            if(!teachSnap.empty){
                const docRef = teachSnap.docs[0].ref;
                await updateDoc(docRef, {
                    firstName: editedUserInput.firstName,
                    lastName: editedUserInput.lastName,
                    email: editedUserInput.email,
                    // Add other fields as needed
                });
            }
        }

        if(userInput.userType === "admin"){
            const admin = query(collection(db, 'admins'), where('uid', '==', userInput.uid));
            const adminSnap = await getDocs(admin);
            if(!adminSnap.empty){
                const docRef = adminSnap.docs[0].ref;
                await updateDoc(docRef, {
                    firstName: editedUserInput.firstName,
                    lastName: editedUserInput.lastName,
                    email: editedUserInput.email,
                    // Add other fields as needed
                });
            }
        }
        
        setUserInput(editedUserInput);

        toggleEditing();
    };

    const handlePasswordReset = async (email, currentPassword, newPassword) => {
        try {
            if (auth.currentUser) {
                // Create a credential
                const credential = EmailAuthProvider.credential(email, currentPassword);

                // Reauthenticate the user
                await reauthenticateWithCredential(auth.currentUser, credential);

                // Update the password
                await updatePassword(auth.currentUser, newPassword);
                console.log('Password updated successfully');
            } else {
                console.log('No user is signed in.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };



    return (
            <div className="bg-blue-100 min-h-screen">
                <div className="flex">  
                    {userInput.userType === 'admin' ? 
                        <AdminSidebar userName={userInput.firstName} userType={userInput.userType}/> :
                        <Sidebar userName={userInput.firstName} userType={userInput.userType}/>
                    }
                    <div className="relative md:ml-64 w-full">
                        <div className="p-6 text-center">
                            <h1 className="text-3xl text-black font-semibold mb-4" data-testid="profile-heading">Profile</h1>
                            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="mb-6 flex justify-center items-center">
                                        {/* If you have a profile picture, uncomment this block */}
                                        {/* <img
                                            src={userInput.profilePicture}
                                            alt="Profile Picture"
                                            className="w-32 h-32 rounded-full mr-4"
                                        /> */}
                                    </div>
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900">User Information</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    {/* Uncomment this block if you want to display the UserID */}
                                    {/* <div className="sm:col-span-3 flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">UserID</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userInput.UserId}</dd>
                                    </div> */}
                                    <div className="sm:col-span-3 flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {isEditing ? 
                                                <input type="text" name="firstName" value={editedUserInput.firstName} onChange={handleInputChange}  className="border-b border-gray-400 focus:outline-none text-black" /> :
                                                <span className='text-black'>{userInput.firstName}</span>
                                            }
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-3 flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {isEditing ? 
                                                <input type="text" name="lastName" value={editedUserInput.lastName} onChange={handleInputChange}  className="border-b border-gray-400 focus:outline-none text-black" /> :
                                                <span className='text-black'>{userInput.lastName}</span>
                                            }
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-3 flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userInput.email}</dd>
                                    </div>
                                    {isEditing ? (
                                        <>
                                            <div className="sm:col-span-3 flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Current Password</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <input type="password" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border-b border-gray-400 focus:outline-none text-black" />
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-3 flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">New Password</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border-b border-gray-400 focus:outline-none text-black" />
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-3 flex justify-end">
                                                <button onClick={() => handlePasswordReset(userInput.email, currentPassword, newPassword)} className='bg-red-500 pt-2 pb-2 pl-7 pr-7 mb-5 rounded-full hover:bg-red-700'>Reset Password</button>
                                            </div>
                                        </>
                                    ) : null}
                                    <div className="sm:col-span-3 flex justify-end">
                                        {isEditing ? (
                                            <button onClick={handleSave} className='bg-green-400 pt-2 pb-2 pl-7 pr-7 mb-5 rounded-full hover:bg-green-600'>Save</button>
                                        ) : (
                                            <button onClick={handleEdit} className='bg-yellow-400 pt-2 pb-2 pl-7 pr-7 mb-5 rounded-full hover:bg-yellow-600'>Edit</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

