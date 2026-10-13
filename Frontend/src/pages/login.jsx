import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email.trim() === "" || form.password.trim() === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      alert("Login successful");

      setForm({
        email: "",
        password: "",
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA] flex items-center justify-center px-5 py-10 text-[#211F1B]">
      <div className="w-full max-w-[430px]">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#211F1B] flex items-center justify-center text-[#F8DFA8] text-lg">
              ₹
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              SplitSnap
            </h1>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back
          </h2>

          <p className="text-[#756F65] text-sm">
            Split expenses. Stay even. Keep it simple.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-[#FFFDF8] border border-[#DED6C7] rounded-xl px-4 py-3.5 outline-none placeholder:text-[#A8A092] focus:border-[#211F1B] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full bg-[#FFFDF8] border border-[#DED6C7] rounded-xl px-4 py-3.5 outline-none placeholder:text-[#A8A092] focus:border-[#211F1B] transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#211F1B] text-[#FFFDF8] font-semibold rounded-xl py-3.5 mt-2 hover:bg-[#302D27] transition"
          >
            Login →
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-[#756F65] mt-7">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#211F1B] hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;