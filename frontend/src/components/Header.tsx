// components/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "./Nav";

const Header: React.FC = () => {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  const handleScroll = (): void => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <header
      className={`px-3 fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ease-in-out ${
        visible
          ? "translate-y-0 bg-opacity-20 bg-gradient-to-b from-blue-950 to-transparent"
          : "-translate-y-full bg-transparent"
      }`}
    >
      <div className="py-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="flex flex-row text-4xl font-semibold gap-0">
              <div id="firstname">Name</div>
              <span className="text-[#0000ff]">.</span>
            </h1>
          </Link>
          <Nav />
          <div className="flex items-center gap-8">
            <Link href="/contact">
              <button className="transition-all duration-300 p-3 rounded-full text-lg border-white border-2 hover:border-transparent font-light text-white bg-transparent hover:scale-110 hover:bg-[#000000] hover:text-white active:bg-[#0000ff] focus:outline-none focus:text-white active:text-black focus:ring focus:ring-[#ffffff]">
                FAQs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
