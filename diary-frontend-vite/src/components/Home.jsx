import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});
  const today = new Date().toDateString();

  // Set target launch date (example: 30 days later)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="min-h-screen text-white bg-[url('/src/assets/bg.jpg')]">
        <Navbar />
      {/* Content */}
       <div className="flex flex-col items-center justify-center text-center mt-24 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to Dear Diary!</h1>
        <p className="mb-6 text-lg">
          Your private space to record your thoughts and memories.  
          We're launching soon, stay tuned!
        </p>

                {/* Today Date in styled boxes */}
        <div className="flex justify-center gap-4 mb-6">
          {[
            { label: "Day", value: new Date().getDate() },
            { label: "Month", value: new Date().toLocaleString("en-US", { month: "long" }) },
            { label: "Year", value: new Date().getFullYear() },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/20 px-4 py-2 rounded-lg shadow-md text-center"
            >
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs uppercase">{item.label}</div>
            </div>
          ))}
        </div>

   
        <div className="flex justify-center items-center mb-6">
          <button onClick={() => navigate('/login')}
           className="bg-yellow-500 px-10 py-3 rounded font-semibold hover:bg-yellow-300 hover:text-blue-900 transition">
            Go to Login
          </button>
        </div>
      </div>

      {/* Footer icons */}
      <div className="absolute bottom-6 flex space-x-6 text-xl">
        <a href="#"><FaFacebookF /></a>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaYoutube /></a>
      </div>
    </div>
    </div>
  );
};

export default Home;

/* const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <img src={logo} alt="Personal Diary Logo" className="w-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Welcome to Personal Diary</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">Your private space to record your thoughts and memories.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Home; */