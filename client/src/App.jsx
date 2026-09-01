import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
  });

  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleFileChange(event) {
    setScreenshot(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (screenshot) {
      data.append("screenshot", screenshot);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/tickets",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setTicketId(result.ticketId);
      setSubmitted(true);
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      title: "",
      description: "",
    });

    setScreenshot(null);
    setSubmitted(false);
    setTicketId("");
    setError("");
  }

  if (submitted) {
    return (
      <main className="page">
        <section className="card success-card">
          <div className="success-icon">✓</div>

          <h1>Request Submitted</h1>

          <p>
            Your support request has been received by the
            System Support Team.
          </p>

          <div className="ticket-id">
            Ticket ID: <strong>{ticketId}</strong>
          </div>

          <button onClick={resetForm}>
            Submit Another Request
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <header>
          <p className="brand">PEARL 27</p>

          <h1>System Support</h1>

          <p className="subtitle">
            Submit a request for assistance with your Sphere
            account.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Employee Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Issue Title</label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Briefly describe the issue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Issue Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="screenshot">
              Screenshot / File
            </label>

            <input
              id="screenshot"
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />

            <small>Maximum file size: 5MB</small>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Submitting..."
              : "Submit Support Request"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;