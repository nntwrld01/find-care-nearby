import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HospitalProfileEdit = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("hospital_token");
    if (!token) {
      navigate("/hospital-login");
      return;
    }
    fetch("/api/hospitals/me/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hospital data");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          latitude: data.latitude?.toString() || "",
          longitude: data.longitude?.toString() || "",
        });
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem("hospital_token");
    try {
      const res = await fetch("/api/hospitals/me/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update profile");
      }
      setSuccess(true);
      setTimeout(() => navigate("/hospital-dashboard"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Hospital Profile</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">Profile updated!</div>}
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
        <Button className="w-full" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <div className="text-center mt-4">
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/hospital-dashboard")}
          >
            Back to Dashboard
          </span>
        </div>
      </form>
    </div>
  );
};

export default HospitalProfileEdit;
