import React, { useState, type JSX } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { useUserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setLogin } = useUserContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Login successful!");
        setLogin(true);
        navigate("/home");
      } else setMessage(data.message || "Login failed");
    } catch (err) {
      console.error(err);
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
      <div className="flex flex-col md:w-[40%] w-[90%]">
        <h2 className="text-[35px] md:mb-[40px] mb-[20px] font-[300]">
          Log In
        </h2>
        {message && <div className="mt-4 text-green-400">{message}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="w-full h-[60px] border-[1px] rounded-md flex flex-row px-3 justify-between items-center mb-4">
            <div className="flex flex-col w-[80%] justify-around">
              <span className="text-[10px] font-semibold opacity-90 text-white">
                EMAIL ADDRESS
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full outline-none bg-transparent text-white text-[12px]"
              />
            </div>
            <CiMail className="text-[20px]" />
          </div>
          <div className="w-full h-[60px] border-[1px] rounded-md flex flex-row px-3 justify-between items-center mb-4">
            <div className="flex flex-col w-[80%] justify-around">
              <span className="text-[10px] font-semibold opacity-90 text-white">
                Password
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full outline-none bg-transparent text-white text-[12px]"
              />
            </div>
                <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (<AiFillEyeInvisible size={24} /> as JSX.Element) : <AiFillEye size={24} />}
                </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-light underline cursor-pointer">Forgot Password?</span>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
