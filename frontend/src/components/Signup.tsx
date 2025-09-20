// src/components/Signup.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { useUserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setLogin } = useUserContext();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Signup successful!");
        // setLogin(true);
        navigate("/");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-transparent text-white">
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
      <div className="flex flex-col md:w-[40%] w-[90%] text-dark justify-center">
        <div className="md:text-[35px] text-[25px] font-[300] leading-[20px] lg:mb-[40px] mb-[20px]">
          Signup
        </div>
        {message && <div className="mt-4 text-green-400">{message}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="w-[90%] h-[60px] border-[1px] rounded-md flex flex-row px-3 justify-between items-center text-semidark mb-4">
            <div className="flex flex-col w-[80%] justify-around">
              <div className="text-[10px] font-semibold opacity-90 text-white">
                EMAIL ADDRESS
              </div>
              <input
                value={form.email}
                type="email"
                name="email"
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full text-dark text-bold text-[12px] outline-none bg-transparent"
              />
            </div>
            <CiMail className="text-[20px]" />
          </div>

          {/* Password Input */}
          <div className="w-[90%] h-[60px] border-[1px] rounded-md flex flex-row px-3 justify-between items-center text-semidark mb-4">
            <div className="flex flex-col w-[80%] justify-around">
              <div className="text-[10px] font-semibold opacity-90 text-white">
                Password
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className="text-dark text-bold text-[12px] outline-none w-full bg-transparent"
              />
            </div>
            <div onClick={togglePasswordVisibility} className="cursor-pointer">
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-[90%] h-[60px] rounded-md flex flex-row justify-between items-center text-semidark">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
