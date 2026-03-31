// App.jsx
import React, { useState } from "react";

export default function Resumpage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !jobDescription || !selfDescription) {
      alert("Please fill all fields and upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/api/interview", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await res.json();
      setData(result && result.interviewReport ? result.interviewReport : null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #0a0a0a;
          color: white;
          font-family: Arial;
        }

        .container {
          padding: 20px;
          max-width: 900px;
          margin: auto;
        }

        .title {
          text-align: center;
          color: #ff2e88;
        }

        .input-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        textarea {
          padding: 10px;
          border-radius: 6px;
          border: none;
          background: #1a1a1a;
          color: white;
        }

        .upload-box {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .btn {
          background: #ff2e88;
          padding: 10px 20px;
          border: none;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .card {
          background: #111;
          padding: 20px;
          border-radius: 10px;
        }

        .question {
          background: #1a1a1a;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
        }
      `}</style>

      <div className="container">
        <h1 className="title">AI Interview Analyzer</h1>

        {/* Inputs */}
        <div className="input-box">
          <textarea
            placeholder="Enter Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <textarea
            placeholder="Enter Self Description"
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />
        </div>

        {/* Upload */}
        <div className="upload-box">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload} className="btn">
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {error && <p>{error}</p>}

        {/* Result */}
        {data && (
          <div className="card">
            <h2>Job Description</h2>
            <p>{data.jobDescription}</p>

            <h2>Self Description</h2>
            <p>{data.selfDescription}</p>

            <h2>Technical Questions</h2>
            {data.technicalQuestions && data.technicalQuestions.map((q, i) => (
              <div key={i} className="question">
                <p><strong>Q:</strong> {q.question}</p>
                <p><strong>A:</strong> {q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
