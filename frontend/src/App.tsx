import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import TextAnim from "./components/TextAnim";
import { useUserContext } from "./UserContext";

const App: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { login } = useUserContext();

  const inViewAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
  };

  useEffect(() => {
    if (login) navigate("/home");

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [login, navigate]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full mt-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/f1bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={inViewAnimation}
        className="text-white mt-20 max-w-4xl mx-auto text-center"
      >
        <h1 className="text-6xl md:text-5xl font-bold mb-6">
          <TextAnim />
        </h1>
        <p className="text-lg md:text-xl mb-8">Description.</p>
      </motion.div>

      <div className="flex flex-row justify-center items-center gap-10">
        <Link to="/login">
          <button className="hover:scale-120 transition-all duration-200 bg-transparent border-2 border-white px-4 pb-2 pt-3 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Login</h2>
          </button>
        </Link>
        <Link to="/signup">
          <button className="hover:scale-120 transition-all duration-200 bg-transparent border-2 border-white px-4 pb-2 pt-3 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Signup</h2>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default App;
