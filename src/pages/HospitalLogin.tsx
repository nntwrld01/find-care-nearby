import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HospitalLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('Login response:', data);
      if (!res.ok || !data.token) {
        throw new Error(data.error || data.detail || "Login failed");
      }
      localStorage.setItem("hospital_token", data.token);
      navigate("/hospital-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Hospital Login</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center mt-4">
          Don't have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/hospital-register")}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
};

export default HospitalLogin;
