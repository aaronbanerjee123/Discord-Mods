'use client';
import CourseNavBar from '../../../components/StuCourseNavBar.jsx';
import Sidebar from '../../../components/Sidebar';
import Loader from '../../../components/Loader.jsx';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase.js';
import { getDoc, doc,getDocs,query,collection, where } from 'firebase/firestore';
import db from '../../../lib/firebase';
import StudentAssignmentCard from '../../../components/StudentAssignmentCard.jsx';
import TeacherAssignmentCard from '../../../components/TeacherAssignmentCard.jsx';

export default function Assignments({params}) {

    const [loading, setLoading] = useState(false);
    const courseCode = params.courseCode;

    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [user,setUser] = useState(null);
    const [userType,setUserType] = useState('user');
    const [userName,setUserName] = useState('non');
    const [submittedAssignments, setSubmittedAssignments] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (auth.currentUser) {
                setUser(auth.currentUser);
                const userInfoRef = collection(db, 'students');
                const q = query(userInfoRef, where('uid', '==', user.uid));
                try {
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        setUserName(doc.data().firstName);
                        setUserType(doc.data().userType);
                    })
                } catch (error) {
                    console.log(error.message);
                }

                const coursesRef = doc(db, 'courses', courseCode);
                const courseSnapshot = await getDoc(coursesRef);

                const submittedAssignmentsNames = [];
                const submittedAssignmentData = [];

                const studentRef = collection(db, 'students');
                const studentQuery = query(studentRef, where("uid", "==", user.uid));
                const studentQuerySnapshot = await getDocs(studentQuery);

                if (!studentQuerySnapshot.empty) {
                    const studentDoc = studentQuerySnapshot.docs[0];
                    const studentRef = studentDoc.ref;
                    const registeredCoursesRef = collection(studentRef, 'registeredCourses');
                    const courseDocRef = doc(registeredCoursesRef, courseCode);
                    const courseDocSnapshot = await getDoc(courseDocRef);

                    if (courseDocSnapshot.exists()) {
                        const submittedAssignmentsData = courseDocSnapshot.data().submittedAssignments || [];
                        submittedAssignmentsData.forEach((assignment) => {
                            submittedAssignmentsNames.push(assignment.name);
                            submittedAssignmentData.push(assignment);
                        })
                    }
                }
                setSubmittedAssignments(submittedAssignmentData);

                if (courseSnapshot.exists()) {
                    const assignmentNames = courseSnapshot.data().currentAssignments || [];
                    
                    const assignmentPromises = assignmentNames.map(async (name) => {
                        let assignmentData = null;
                        const quizRef = doc(db, 'quizzes', name);
                        const essayRef = doc(db, 'essays', name);

                        const [quizSnapshot, essaySnapshot] = await Promise.all([
                            getDoc(quizRef),
                            getDoc(essayRef)
                        ]);

                        if (quizSnapshot.exists() && !submittedAssignmentsNames.includes(name)) {
                            assignmentData = quizSnapshot.data();
                        } else if (!submittedAssignmentsNames.includes(name)) {
                            assignmentData = essaySnapshot.data();
                        }

                        return { name, ...assignmentData };
                    });

                    const assignments = await Promise.all(assignmentPromises);
                    setCurrentAssignments(assignments);
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, [courseCode]); // Add courseCode as a dependency

    // Demo assignments array to display some assignments but will later have data 
    // displayed from the database
    // const assignments = [
    //     { title: 'Assignment 1', dueDate: '2022-01-01', points: 100 },
    //     { title: 'Assignment 2', dueDate: '2022-01-15', points: 150 },
    //     { title: 'Assignment 3', dueDate: '2022-01-15', points: 150 },
    //     { title: 'Assignment 4', dueDate: '2022-01-15', points: 150 },
    //     { title: 'Assignment 5', dueDate: '2022-01-15', points: 150 },
    // ];

    useEffect(() => {
        // Simulate a network request
        setTimeout(() => {
            setLoading(false); // Set loading to false after 3 seconds
        }, 1000);
    }, []);

    if (loading) {
        return <Loader />; // Return the Loading component if loading is true
    }

    return (
        <div className="flex flex-col md:flex-row bg-blue-100">
            <Sidebar userName={userName} userType={"Student"} />
            <div className="md:ml-64 fixed">
                <CourseNavBar courseCode={courseCode} />
            </div>
            <div className="p-6 text-center w-full md:pl-64 md:ml-72">
                <h1 className="text-3xl text-black font-bold mb-4" data-testid="course-heading">Course Name</h1>
                <h2 className="text-3xl text-black font-semibold mt-4 mb-4" data-testid="assignments-heading">Assignments</h2>
                <div className="flex justify-end">
                </div>
                <div className="overflow-x-auto">
                    {/* {assignments.map((assignment, index) => (
                         <a href="displayAssignments" key={index} >
                        <div key={index} className="flex items-center justify-between bg-gray-100 mb-4 p-4 rounded border border-gray-300">
                          
                            <div>
                                <h3 className="text-lg font-semibold text-black">{assignment.title}</h3>
                                <p className="text-sm text-gray-600">Due Date: {assignment.dueDate}</p>
                                <p className="text-sm text-gray-600">Points: {assignment.points}</p>
                            </div>
                        </div>
                        </a>
                    ))} */}
                    {currentAssignments.map((assignment, index) => (
                      (userType == 'Student' && <StudentAssignmentCard assignment={assignment} courseCode={courseCode} />) ||
                      (userType == 'Teacher' && <TeacherAssignmentCard assignment={assignment} courseCode = {courseCode} />)
                    ))}

            <div className="overflow-x-auto">
                <h2 className="text-3xl text-black font-semibold text-center mb-4">Submitted Assignments</h2>
                <div className="grid grid-cols-1 text-black md:grid-cols-1 lg:grid-cols-1 gap-4">
                    {/* Display submitted assignments */}
                    {submittedAssignments.map((assignment, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-6 border flex flex-col items-center border-gray-300">
                            <p className="font-semibold text-lg">{assignment.name}</p>
                            <p className="text-gray-500 mb-4">Grade: {assignment.grade ? assignment.grade : "Not graded yet"}</p>
                        </div>
                    ))}
                </div>
            </div>


                </div>
            </div>
        </div>
    );
}