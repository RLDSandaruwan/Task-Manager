import React from "react";
import { FaTasks } from "react-icons/fa";

function Header() {
    return (
        <header className="w-full bg-white bg-opacity-80 shadow-md py-4 px-6 flex items-center justify-begin">
            {/* Title + Icon aligned to the right */}
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-purpleMain tracking-wide">
                    Task Manager
                </h1>
                <FaTasks className="text-3xl text-orangeMain" />
            </div>
        </header>

    );
}

export default Header;
