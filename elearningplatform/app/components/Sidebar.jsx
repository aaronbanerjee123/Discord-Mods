'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import { signOut } from 'firebase/auth';
import { FaHome, FaBook, FaPencilAlt, FaFileAlt, FaUser, FaChalkboard, FaSignOutAlt } from 'react-icons/fa';

//Creating a sidebar component to be able to use on all the pages for the app

export default function Sidebar({ userName }) {
    // added isMinimized state that monitors the state of the sidebar and used below to determine 
    // whether the sidebar is minimized or not 

    // When Minimized thw width is changed and the text is replaced with icons 
    const [isMinimized, setIsMinimized] = useState(false);
    
    //Functions for handling sign out in the backend
    const handleSignOut = async () => {
        try {
            const router = useRouter();
            await signOut(auth); 
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <div className={`h-screen bg-blue-400 ${isMinimized ? 'w-20' : 'w-64'} fixed top-0 left-0 overflow-y-auto transition-all duration-300`}>
            <div className="px-6 py-4">
                <h2 className="text-4xl font-bold text-gray-800">
                    <Link href="/">
                        {isMinimized ? <FaChalkboard/> : 'E-Learning Platform'} 
                    </Link>
                </h2>
                <p className="mt-2 font-extrabold text-gray-600">HELLO {userName}</p>
            </div>
            <nav>
                <Link href="/dashboard">
                    <div className="block px-6 py-2 font-medium text-gray-800 hover:bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                        {isMinimized ? <FaHome/> : 'Dashboard'}
                    </div>
                </Link>
                <Link href="/courses">
                    <div className="block px-6 py-2 font-medium text-gray-800 hover:bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                        {isMinimized ? <FaBook/> : 'Courses'}
                    </div>
                </Link>
                <Link href="/assignments">
                    <div className="block px-6 py-2 font-medium text-gray-800 hover:bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                        {isMinimized ? <FaPencilAlt/> : 'Assignments'}
                    </div>
                </Link>
                <Link href="/grades">
                    <div className="block px-6 py-2 font-medium text-gray-800 hover:bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                        {isMinimized ? <FaFileAlt/> : 'Grades'}
                    </div>
                </Link>
                <Link href="/profile">
                    <div className="block px-6 py-2 font-medium text-gray-800 hover:bg-gray-200 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                        {isMinimized ? <FaUser/> : 'Profile'}
                    </div>
                </Link>
            </nav>
            
            <button onClick={() => setIsMinimized(!isMinimized)} className=" ml-6 mt-6 w-10 h-10 bg-black p-2 rounded-full focus:outline-none">
                    {isMinimized ? '>' : '<'}
            </button>

            <button onClick={handleSignOut} className="block px-6 py-2 mt-80 ml-5 font-bold bg-red-500 text-gray-800 hover:bg-red-600 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                <Link href="/login">{isMinimized ? <FaSignOutAlt /> : 'Sign Out'}</Link>
            </button>
        </div>
    );
}