import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Service {
  id?: number;
  name: string;
  description: string;
}

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<any>(null);
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
    setLoading(true);
    Promise.all([
      fetch("/api/hospitals/me/", {
        headers: { Authorization: `Token ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hospital profile");
        return res.json();
      }),
      fetch("/api/services/", {
        headers: { Authorization: `Token ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
    ])
      .then(([hospitalData, servicesData]) => {
        setHospital(hospitalData);
        setServices(servicesData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("hospital_token");
    navigate("/hospital-login");
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="mb-4 text-red-600">{error}</div>
        <Button onClick={handleLogout}>Log out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">{hospital?.name?.charAt(0) || "H"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{hospital?.name}</h2>
          <div className="text-blue-600 font-medium">{hospital?.email}</div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Manage Services</h3>
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
          <Button className="w-full mb-2 bg-blue-600 text-white hover:bg-blue-700" type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add Service"}
          </Button>
        </form>
        <div>
          <h4 className="font-semibold mb-2">Your Services</h4>
          {services.length === 0 ? (
            <div className="text-gray-500">No services added yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col justify-between border rounded-lg shadow p-4 bg-gray-50 hover:shadow-lg transition min-h-[120px]"
                >
                  <div>
                    <div className="font-semibold text-blue-700 mb-1 truncate">{service.name}</div>
                    <div className="text-xs text-gray-600 line-clamp-3">{service.description}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteService(service.id)}
                    disabled={saving}
                    className="mt-4 self-end"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button className="w-full mt-6 bg-gray-100 text-blue-600 hover:bg-blue-50" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default HospitalDashboard;
