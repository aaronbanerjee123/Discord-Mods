import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div>
      {/* The component Navbar is used below and is implemented in the Navbar.tsx file under components*/}
      <Navbar /> 
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold pt-10 font-mono">
          Welcome to our E-Learning Platform
        </h1>
        <p className="mt-3 text-2xl font-mono">
          Join us and explore the world of knowledge.
        </p>
        <div className="flex mt-6 justify-center">
          <a className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            <Link href="/login">
              Get Started
              {/* This button would lead th user to the login page */}
            </Link>
          </a>
        </div>
      </main>
    </div>
  );
}