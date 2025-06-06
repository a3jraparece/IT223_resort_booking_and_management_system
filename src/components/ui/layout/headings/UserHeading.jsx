// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logout from "../../../../utils/logout";
// const UserHeading = () => {
//     const [loggedIn, setLoggedIn] = useState(false);

//     const navigate = useNavigate();

//     const navigateToLogInPage = () => {
//         navigate('/oceanview/login');
//     };

//     const handleLogout = () => {
//         logout(navigate);
//     }

//     useEffect(() => {
//         const userId = localStorage.getItem('user_id');
//         setLoggedIn(!!userId);
//     }, []);

//     return (
//         <header className="border border-gray-400 w-full sticky top-0 bg-white z-10 px-4" style={{ paddingTop: '0.70rem', paddingBottom: '0.50rem' }}>

//             <div className="flex justify-between items-center">
//                 <div className={`flex items-center space-x-10`}>
//                     <div className={`flex items-center justify-center space-x-2`}>
//                         <img className={`size-10`} src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740" alt="Ocean View Logo" />
//                         <div>Ocean View</div>
//                     </div>
//                     <div className={`space-x-4`}>
//                         <a href="">Home</a>
//                         <a href="">About Us</a>
//                         <a href="">Terms and Privacy</a>
//                     </div>
//                 </div>
//                 {loggedIn ?
//                     <button type="button" onClick={handleLogout}>Log Out</button>
//                     :
//                     <button type="button" onClick={navigateToLogInPage}>Log In</button>
//                 }
//             </div>
//         </header>
//     );
// }

// export default UserHeading;

import { useEffect, useState, useRef } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import logout from "../../../../utils/logout";
import { FaUserCog, FaSignOutAlt, FaBell, FaRegBookmark, FaClipboardList, FaHistory } from "react-icons/fa";

import logo from '../../../../assets/images/logo/ov_logo.png';
import { IoIosArrowDown } from "react-icons/io";

import useDropdownState from '../../../../utils/useDropdownState';



const UserHeading = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] =  useDropdownState();
    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const navigateToLogInPage = () => {
        navigate("/oceanview/login");
    };

    const handleLogout = () => {
        logout(navigate);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const [isOpenProfile, setIsOpenProfile] = useDropdownState();
    const [isOpenNotification, setIsOpenNotification] = useState(false);

    const handleOpenProfile = () => {
        setIsOpenProfile(!isOpenProfile);
        if (isOpenNotification) {
            setIsOpenNotification(!isOpenNotification);
        }
    }

    const handleOpenNotif = () => {
        setIsOpenNotification(!isOpenNotification);
        if (isOpenProfile) {
            setIsOpenProfile(!isOpenProfile);
        }
    }

    const [userProfile, setUserProfile] = useState();
    const [userName, setUserName] = useState();

    useEffect(() => {
        fetch(`http://localhost:8000/api.php?controller=User&action=getUserById&id=${localStorage.getItem('user_id')}`)
            .then((response) => response.json())
            .then((data) => {
                setUserProfile(data.profile_photo);
                setUserName(data.username);
            })
            .catch((error) => console.error(error));
    }, []);


    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        setLoggedIn(!!userId);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const link_styles = {
        active: 'bg-green-600 text-white pointer-events-none',
        passive: 'bg-white cursor-pointer',
    };

    const myAccountmatch = useMatch('/oceanview/myaccount/*');
    const bookmarkmatch = useMatch('/oceanview/bookmarks/*');
    const myreservationsmatch = useMatch('/oceanview/myreservations/*');
    const transactionshistorymatch = useMatch('/oceanview/transactionshistory/*');

    const homeMatch = useMatch("/oceanview");
    const aboutMatch = useMatch("/oceanview/about");
    const termsMatch = useMatch("/oceanview/termsandprivacy");
    const resortsMatch = useMatch("/oceanview/resortslist");

    return (
        <header className="border-b w-full sticky top-0 bg-white z-10 px-6 py-[5px] shadow-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-10">
                    <div className="flex items-center space-x-2">
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={logo}
                            alt="Ocean View Logo"
                        />
                        <h1 className="text-xl font-semibold text-gray-600">Ocean View</h1>
                    </div>
                    <nav className="space-x-1 text-sm text-gray-600">
                        <div className="flex space-x-2">
                            <button
                                className={`hover:bg-gray-200 p-2 ${homeMatch ? "text-green-700 font-semibold" : "text-gray-700"
                                    }`}
                                onClick={() => navigate("/oceanview")}
                            >
                                Home
                            </button>

                            <button
                                className={`hover:bg-gray-200 p-2 ${aboutMatch ? "text-green-700 font-semibold" : "text-gray-700"
                                    }`}
                                onClick={() => navigate("/oceanview/about")}
                            >
                                About Us
                            </button>

                            <button
                                className={`hover:bg-gray-200 p-2 ${termsMatch ? "text-green-700 font-semibold" : "text-gray-700"
                                    }`}
                                onClick={() => navigate("/oceanview/termsandprivacy")}
                            >
                                Terms & Privacy
                            </button>

                            <button
                                className={`hover:bg-gray-200 p-2 ${resortsMatch ? "text-green-700 font-semibold" : "text-gray-700"
                                    }`}
                                onClick={() => navigate("/oceanview/resortslist")}
                            >
                                Resorts
                            </button>
                        </div>
                    </nav>
                </div>

                {loggedIn ? (
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <FaBell className="text-gray-600 text-xl" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">15</span>
                            </div>
                            <div className={`text-sm`}>
                                {userName ?? 'Username'}
                            </div>
                            <button onClick={toggleMenu} className="relative focus:outline-none">
                                <div className={`size-10 p-[0.2rem] rounded-full bg-gray-100 hover:bg-gray-200 relative`}>
                                    <img src={userProfile ? `${userProfile}` : '/images/user_profiles/default_profile.png'} className="w-full h-full rounded-full" alt="User Profile" />
                                    <div className=" flex justify-center items-center size-4 border-2 border-white rounded-full absolute bottom-0 right-0 bg-gray-100 pointer-events-none">
                                        <IoIosArrowDown className={` duration-75 ${menuOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>
                        </div>

                        {menuOpen && (
                            <div className="absolute right-0 w-48 bg-white rounded shadow-lg py-1 z-50 border border-gray-200">
                                <button
                                    onClick={() => navigate("/oceanview/myaccount")}
                                    className={`w-full px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 
                                        ${myAccountmatch ? link_styles.active : link_styles.passive}`}
                                >
                                    <FaUserCog />
                                    <span>Account</span>
                                </button>

                                <button
                                    onClick={() => navigate("/oceanview/bookmarks")}
                                    className={`w-full px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 
                                         ${bookmarkmatch ? link_styles.active : link_styles.passive}`}
                                >
                                    <FaRegBookmark />
                                    <span>Bookmarks</span>
                                </button>

                                <button
                                    onClick={() => navigate("/oceanview/myreservations")}
                                    className={`w-full px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 
                                        ${myreservationsmatch ? link_styles.active : link_styles.passive}`}
                                >
                                    <FaClipboardList />
                                    <span>Reservation</span>
                                </button>

                                <button
                                    onClick={() => navigate("/oceanview/transactionshistory")}
                                    className={`w-full px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 
                                        ${transactionshistorymatch ? link_styles.active : link_styles.passive}`}
                                >
                                    <FaHistory />
                                    <span>Transactions</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-100"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={navigateToLogInPage}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                        Log In
                    </button>
                )}
            </div>
        </header>
    );
};

export default UserHeading;
