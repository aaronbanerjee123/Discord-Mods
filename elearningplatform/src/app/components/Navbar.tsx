import Link from 'next/link';
// Below is the Navbar that will be used to navigate across the pages throughout the entire platform
// and can be reused across multiple pages by calling the <Navbar /> tag 

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">E-Learning Platform</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto lg:justify-end">
                <div className="text-sm">
                    <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        <Link href="/settings">
                            Settings
                        </Link>
                    </a>
                    <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        <Link href="/login">
                            Login
                        </Link>
                    </a>
                    <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        <Link href="/profile">
                            Profile
                        </Link>
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;