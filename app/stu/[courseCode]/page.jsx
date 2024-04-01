'use client';
import Loader from '../../components/Loader';
import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import Sidebar from '../../components/Sidebar';
import CourseNavBar from '../../components/StuCourseNavBar';

import db, { auth } from '../../lib/firebase';

export default function CoursePage() {
    const [userName, setUserName] = useState('non');
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userInfoRef = collection(db, 'Userinfo');
                    const q = query(userInfoRef, where('uid', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        setUserName(doc.data().firstName);
                    });
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                console.log('No user');
            }
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const storage = getStorage();
        const pdfRef = ref(storage, 'COSC 320-Assignment 4- 2023-2024-T2.pdf');
        getDownloadURL(pdfRef)
            .then((url) => {
                setPdfUrl(url);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            })
            .catch((error) => {
                console.log('Error getting PDF URL:', error);
            });
    }, []);

    if(loading){
        return <Loader/>;
    }

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar userName={userName} />
            <div className="relative md:ml-64">
                <CourseNavBar />
            </div>
            <div className="p-6 w-screen bg-blue-100 text-center">
                <h1 className="text-3xl text-black font-semibold mb-8" data-testid="course-heading">Course Name</h1>
                <div className="mt-4 text-left  bg-white rounded-md shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">Info about the Course</h2>
                    <p className="leading-relaxed text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
                    </p>
                </div>
                {/* <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">Resources</h2>
                    <ul className="list-disc ml-4 text-left">
                        <li>
                            <a href="#resource1" className="text-blue-500 hover:underline">Resource 1</a>
                            { {pdfUrl && <iframe src={pdfUrl} className="mt-2 w-full h-screen" />} }
                        </li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}
