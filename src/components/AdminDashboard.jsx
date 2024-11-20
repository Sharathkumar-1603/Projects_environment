import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  // Fetch reports
  const fetchReports = async () => {
    const response = await fetch("http://localhost:3000/reports");
    const data = await response.json();
    setReports(data);
  };

  // Update progress
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

  // Handle feedback
  const addFeedback = async (reportId, feedback) => {
    const response = await fetch(`http://localhost:3000/reports/${reportId}/feedback`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });

    if (response.ok) {
      fetchReports();
      alert("Feedback added!");
    } else {
      alert("Error adding feedback.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Address</th>
            <th>Description</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {reports.map((report) => (
    <tr key={report.id}>
      <td>{report.name}</td>
      <td>{report.address}</td>
      <td>
        {report.description}
        <br />
        {report.image && (
          <img
            src={`http://localhost:3000/uploads/${report.image}`} // Replace with your API's image path
            alt="Report"
            style={{ width: "100px", height: "auto", marginTop: "5px" }}
          />
        )}
      </td>
      <td>{report.progress}</td>
      <td>
        <button onClick={() => updateProgress(report.id, "In Progress")}>In Progress</button>
        <button onClick={() => updateProgress(report.id, "Completed")}>Completed</button>
        <div>
          <button onClick={() => addFeedback(report.id, "Like")}>Like</button>
          <button onClick={() => addFeedback(report.id, "Comment")}>Comment</button>
          <button onClick={() => addFeedback(report.id, "Approved")}>Approve</button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default AdminDashboard;
