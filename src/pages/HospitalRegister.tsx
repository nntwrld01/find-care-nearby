import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HospitalRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }
      setSuccess(true);
      setTimeout(() => navigate("/hospital-login"), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Hospital Registration</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">Registration successful! Redirecting...</div>}
        <input
          name="name"
          type="text"
          placeholder="Hospital Name"
          className="input input-bordered w-full mb-4"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          type="text"
          placeholder="Address"
          className="input input-bordered w-full mb-4"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          className="input input-bordered w-full mb-4"
          value={form.phone}
          onChange={handleChange}
          required
        />
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
        <div className="flex gap-2 mb-4">
          <input
            name="latitude"
            type="number"
            placeholder="Latitude"
            className="input input-bordered w-1/2"
            value={form.latitude}
            onChange={handleChange}
            required
            step="any"
          />
          <input
            name="longitude"
            type="number"
            placeholder="Longitude"
            className="input input-bordered w-1/2"
            value={form.longitude}
            onChange={handleChange}
            required
            step="any"
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="text-center mt-4">
          Already have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/hospital-login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default HospitalRegister;
