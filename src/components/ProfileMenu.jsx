import { useState } from 'react';
import {LogOut, User, User2Icon} from "lucide-react";

const ProfileMenu = ({ user, onProfile, onLogout }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md"
            >
                {user ? (
                    <span className="text-sm">Welcome, {user.username}</span>
                ) : (
                    <span>Profile</span>
                )}
                <User/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <button
                        onClick={() => {
                            onProfile?.();
                            setOpen(false);
                        }}
                        className="flex w-full  px-4 py-2 hover:bg-gray-100"
                    >
                       <User2Icon/> &nbsp; Profile
                    </button>
                    <button
                        onClick={() => {
                            onLogout?.();
                            setOpen(false);
                        }}
                        className="w-full flex px-4 py-2 hover:bg-gray-100"
                    >
                        <LogOut/>&nbsp; Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
