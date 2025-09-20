"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserContext } from '../UserContext';  // Import context hook

const links = [
    {
        name: "home",
        path: "/",
    },
    {
        name: "dashboard",
        path: "/dashboard",
    },
    {
        name: "Documentation",
        path: "/documentation",
    },
    {
        name: "About Us",
        path: "about",
    },
];

const Nav = () => {
    const { login, setLogin } = useUserContext();  // Access login state from context
    const pathname = usePathname();
    const logout = () => {
        setLogin(false);
    }
    return (
        <nav className="flex flex-row justify-center items-center gap-8">
            {login && 
            links.map((link, index) => {  // Only render links if logged in
                return (
                    <Link
                        href={link.path}
                        key={index}
                        className={`${link.path === pathname &&
                            "text-[#0000ff] border-b-2 border-[#0000ff]"
                            } capitalize font-medium hover:text-[#0000ff] transition-all`}
                    >
                        {link.name}
                    </Link>
                );
            })      
            }
            {login && (<button onClick={logout}  className="transition-all duration-300 p-3 rounded-full text-lg border-white border-2 hover:border-transparent font-light text-white bg-transparent hover:scale-110 hover:bg-[#000000] hover:text-white active:bg-[#0000ff] focus:outline-none focus:text-white active:text-black focus:ring focus:ring-[#ffffff]">
                                Logout
                            </button>
                        )
            }
        </nav>
    );
};

export default Nav;
