import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/clearpath-logo.png'

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name.");
      return;
    }

    const url = isLogin
      ? "https://clearpath-backend-sc9k.onrender.com/api/auth/login"
      : "https://clearpath-backend-sc9k.onrender.com/api/auth/register";

    const body = isLogin
      ? { email, password }
      : { email, password, nickname: name };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("nickname", data.nickname);
    }

    navigate("/");
  }

  function handleGoogleLogin() {
    window.location.href = "https://clearpath-backend-sc9k.onrender.com/oauth2/authorization/google"
  }

  return (

    <div className="max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg-accent-light)" }}>

      {/* Logo */}
      <img src={logo} alt="ClearPath" style={{ height: 40, marginBottom: 32 }} />

      {/* Tab */}
      <div className="flex w-full rounded-xl overflow-hidden mb-6 border" style={{ borderColor: "var(--border-color)" }}>
        <button
          onClick={() => { setIsLogin(true); setError(null); }}
          className="flex-1 py-2.5 text-sm font-medium transition-all"
          style={{
            backgroundColor: isLogin ? "var(--accent)" : "var(--bg-card)",
            color: isLogin ? "var(--bg-card)" : "var(--accent)",
          }}>
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(null); }}
          className="flex-1 py-2.5 text-sm font-medium transition-all"
          style={{
            backgroundColor: !isLogin ? "var(--accent)" : "var(--bg-card)",
            color: !isLogin ? "var(--bg-card)" : "var(--accent)",
          }}>
          Register
        </button>
      </div>

      {/* Form */}
      <div className="w-full space-y-3">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: "var(--border-color)" }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: "var(--border-color)" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full px-4 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: "var(--border-color)" }}
        />

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}>
          {isLogin ? "Login" : "Create Account"}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center w-full my-5">
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
        <span className="px-3 text-xs" style={{ color: "var(--accent)" }}>or</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full py-2.5 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Continue with Google
      </button>

      {/* Footer */}
      {isLogin && (
        <button className="mt-4 text-xs" style={{ color: "var(--accent)" }}>
          Forgot password?
        </button>

      )}
      <button
        onClick={() => navigate('/')}
        style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "8px" }}>
        Skip for now
      </button>
    </div>
  );
}