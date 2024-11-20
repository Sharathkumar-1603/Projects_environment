import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './Dashboard.css'

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [markerPosition, setMarkerPosition] = useState(null);

  const fetchReports = async () => {
    const response = await fetch("http://localhost:3000/reports");
    const data = await response.json();
    setReports(data);
  };

  const fetchCoordinates = async (address) => {
    const apiKey = "9f57031cf8ad48128c3dfbfbf03ca4c0";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        if (lat && lng) {
          return { lat, lng };
        } else {
          alert("Invalid coordinates received");
          return null;
        }
      } else {
        alert("Address not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, description, progress } = e.target.elements;

    const coordinates = await fetchCoordinates(address.value);
    if (!coordinates) return;

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("address", address.value);
    formData.append("description", description.value);
    formData.append("progress", progress.value);
    formData.append("latitude", coordinates.lat);
    formData.append("longitude", coordinates.lng);

    const imageInput = e.target.querySelector('input[type="file"]');
    if (imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    const response = await fetch("http://localhost:3000/reports", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      fetchReports();
      alert("Report submitted successfully!");
    } else {
      alert("Error submitting the report.");
    }

    e.target.reset();
  };

  const updateProgress = async (reportId, progress) => {
    const response = await fetch(`http://localhost:3000/reports/${reportId}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });

    if (response.ok) {
      fetchReports();
      alert("Progress updated!");
    } else {
      alert("Error updating progress.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Report Dirty Areas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="text" name="address" placeholder="Address" required />
        <textarea name="description" placeholder="Description" rows="3" required />
        <select name="progress">
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="file" name="image" />
        <button type="submit">Submit Report</button>
      </form>

      <MapContainer center={mapCenter} zoom={5} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {reports.map((report) => {
          if (report.latitude && report.longitude) {
            return (
              <Marker key={report.id} position={[report.latitude, report.longitude]}>
                <Popup>
                  <strong>{report.name}</strong>
                  <br />
                  <em>{report.address}</em>
                  <br />
                  {report.description}
                  <br />
                  Progress: {report.progress}
                  <br />
                  {report.image && (
                    <img
                      src={`http://localhost:3000/uploads/${report.image}`}
                      alt="Report"
                      style={{ width: "100%", height: "auto", marginTop: "10px" }}
                    />
                  )}
                  <br />
                  <button onClick={() => updateProgress(report.id, "In Progress")}>In Progress</button>
                  <button onClick={() => updateProgress(report.id, "Completed")}>Completed</button>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Dashboard;
