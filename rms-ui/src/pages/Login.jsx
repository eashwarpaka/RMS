import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Decode role
      const decoded = jwtDecode(token);

      // Redirect based on role
      if (decoded.role === "admin") {
        window.location.href = "/admin";
      } else if (decoded.role === "cashier") {
        window.location.href = "/cashier";
      } else if (decoded.role === "kitchen") {
        window.location.href = "/kitchen";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          RMS Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
