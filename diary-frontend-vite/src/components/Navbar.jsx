import React from "react";
import { Link } from 'react-router-dom';
import logo from "../assets/LOOO.png"; 

const Navbar = () => {
  return (
    <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
      {/* Logo + Site Name */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Dear Diary Logo" className="h-10 w-10" />
        <span className="text-white font-bold text-xl">Dear Diary</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-white font-medium">
        <li>
          <Link to="/" className="hover:text-blue-950">Home</Link>
        </li>
        <li>
          <a href="#about" className="hover:text-blue-950">About</a>
        </li>
        <li>
          <a href="#contact" className="hover:text-blue-950">Contact</a>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white text-2xl">☰</button>
    </nav>
  );
};

export default Navbar;
