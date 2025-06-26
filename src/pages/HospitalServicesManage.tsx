import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Service {
  id?: number;
  name: string;
  description: string;
}

const HospitalServicesManage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("hospital_token");

  useEffect(() => {
    if (!token) {
      navigate("/hospital-login");
      return;
    }
    fetch("/api/services/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/services/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newService),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to add service");
      }
      const created = await res.json();
      setServices([...services, created]);
      setNewService({ name: "", description: "" });
    } catch (err: any) {
      setError(err.message || "Failed to add service");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id?: number) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/services/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Hospital Services</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form className="mb-6" onSubmit={handleAddService}>
          <input
            name="name"
            type="text"
            placeholder="Service Name"
            className="input input-bordered w-full mb-2"
            value={newService.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="input input-bordered w-full mb-2"
            value={newService.description}
            onChange={handleInputChange}
            required
          />
          <Button className="w-full mb-2" type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add Service"}
          </Button>
        </form>
        <div>
          <h3 className="font-semibold mb-2">Your Services</h3>
          {services.length === 0 ? (
            <div className="text-gray-500">No services added yet.</div>
          ) : (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id} className="flex justify-between items-center border rounded p-2">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-xs text-gray-600">{service.description}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteService(service.id)}
                    disabled={saving}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-center mt-4">
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/hospital-dashboard")}
          >
            Back to Dashboard
          </span>
        </div>
      </div>
    </div>
  );
};

export default HospitalServicesManage;
