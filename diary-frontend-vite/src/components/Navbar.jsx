import React from "react";
import logo from "../assets/LOOO.png"; 

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      {/* Logo + Site Name */}
      <div className="flex items-center space-x-3 ">
        <img src={logo} alt="Dear Diary Logo" className="h-10 w-10" />
        <span className="text-white font-bold text-xl">Dear Diary</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-white font-medium">
        <li className="hover:text-blue-950 cursor-pointer">Home</li>
        <li className="hover:text-blue-950 cursor-pointer">About</li>
        <li className="hover:text-blue-950 cursor-pointer">Contact</li>
      </ul>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white text-2xl">☰</button>
    </nav>
  );
};

export default Navbar;
