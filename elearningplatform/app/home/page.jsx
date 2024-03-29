'use client';
import Link from "next/link";
import Sidebar from "../components/Sidebar"; 
import CourseCard from "../components/CourseCard";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import db from '../lib/firebase'; 
import { auth } from '../lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { fetchCourseInfo } from "../components/FetchData";

// Home Page that will be seen by the student user on logging in

export default function home(){
    const [userName, setUserName] = useState('non');
    const [user,setUser] = useState();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const courseData = await fetchCourseInfo();
        setCourses(courseData);
        };

        fetchData();
    }, []);

    // create a new function that will get the CourseCard info on clicking it and then go to the
    // backend and get info about that course to redirect to the particular Course page 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(auth.currentUser){
              setUser(auth.currentUser);
                console.log(user);
                const userInfoRef = collection(db,'Userinfo');
                const q = query(userInfoRef, where('uid','==',user.uid));
                console.log(q);
                try{
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        setUserName(doc.data().firstName);
                    })
                }catch(error){
                    console.log(error.message);
                }

              }  else {
                // User is signed out
                console.log('No user');
            }

            console.log(userName);
        }); 

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [userName]);

    return (
        <div className="flex flex-col md:flex-row ml-80">
            <Sidebar userName={ userName } />
            <div className="mt-4 md:mt-0 md:ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8">
                {courses.map(course => (
                    <Link key={course.id} href={`/[courseCode]?courseCode=${course.courseCode}`}>
                    <CourseCard courseCode={course.courseCode} courseName={course.courseName} imageUrl={course.imageUrl}/>
                    </Link>
                ))}
            </div>
        </div>
    );
}