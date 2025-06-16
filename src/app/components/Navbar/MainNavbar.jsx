import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBell, FiUser, FiFilter, FiHelpCircle, FiMonitor, FiMenu, FiSun, FiMoon } from 'react-icons/fi';

const MainNavbar = ({ onMenuClick, showMenuButton }) => {
    const pathname = usePathname();
    const [now, setNow] = useState(null);

    useEffect(() => {
        // Set initial time and update every minute
        const update = () => setNow(new Date());
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    const dateStr = now
        ? now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        : '';
    const timeStr = now
        ? now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        : '';

    const navItems = [
        { name: "Map", path: "/map" },
        { name: "Dashboard", path: "/" },
        { name: "Video", path: "/video" },
        { name: "Settings", path: "/settings" }
    ];

    // Theme toggle logic
    const [dark, setDark] = useState(false);
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);

    return (
        <nav className="bg-background shadow-md w-full z-50 border-b border-border transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Hamburger for mobile + Branding */}
                    <div className="flex items-center">
                        {showMenuButton && (
                            <button
                                className="mr-3 md:hidden p-2 rounded hover:bg-accent transition"
                                onClick={onMenuClick}
                                aria-label="Open sidebar"
                            >
                                <FiMenu className="w-6 h-6 text-foreground" />
                            </button>
                        )}
                        <span className="text-primary font-bold text-sm leading-tight">Aethernet</span>
                        <span className="hidden sm:inline text-muted-foreground"> | </span>
                        <span className="text-muted-foreground text-center text-sm leading-tight -mt-1 hidden sm:inline"> Air Pollution Modern Solution</span>
                    </div>
                    {/* Center: Navigation (hidden on mobile) */}
                    {/* <div className="hidden md:flex items-center space-x-4 h-full">
                        {navItems.map(item => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`h-full flex items-center text-sm font-semibold min-h-max px-2 py-1 rounded transition ${
                                    pathname === item.path
                                        ? "border-b-2 border-primary text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div> */}
                    {/* Right: Date, Time, Icons, Theme Toggle */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs text-muted-foreground">{dateStr}</span>
                            <span className="text-base font-semibold text-foreground">{timeStr}</span>
                        </div>
                        <FiBell className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Alarm" />
                        <FiUser className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Profile" />
                        <FiFilter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Filter" />
                        <span className="relative">
                            <FiHelpCircle className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Help" />
                            <span className="absolute top-0 right-0 block w-2 h-2 bg-primary rounded-full"></span>
                        </span>
                        <FiMonitor className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Screen" />
                        <button
                            className="ml-2 p-2 rounded hover:bg-accent transition"
                            onClick={() => setDark(d => !d)}
                            aria-label="Toggle theme"
                        >
                            {dark ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5 text-blue-500" />}
                        </button>
                    </div>
                </div>
                {/* Mobile nav links */}
                <div className="flex md:hidden justify-center items-center space-x-4 mt-2">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center text-xs font-semibold px-2 py-1 rounded transition ${
                                pathname === item.path
                                    ? "border-b-2 border-primary text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar;