import { Outlet } from 'react-router-dom'

import AdminHeading from "../components/ui/layout/headings/AdminHeading";
import AdminSideNav from "../components/ui/layout/side_navs/AdminSideNav";
import { useState } from 'react';

import useNavbarState from '../utils/useNavbarState';

const AdminLayout = () => {

    const [isSideNavOpen, setIsSideNavOpen] = useNavbarState();

    return (
        <div className='flex'>
            <AdminSideNav isOpen={isSideNavOpen} />
            <div className="overflow-x-hidden w-screen h-lvh">
                <AdminHeading toggleSideNav={() => setIsSideNavOpen(!isSideNavOpen)} isOpen={isSideNavOpen} />
                <main className="p-2 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;