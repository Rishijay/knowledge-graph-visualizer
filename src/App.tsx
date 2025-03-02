import React, { useState } from "react";
import GraphRenderer from "./GraphRenderer";

const App = () => {
  const [ttlUrl, setTtlUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");

  const handleSubmit = () => {
    if (
      ttlUrl.trim() !== "" &&
      ttlUrl.startsWith("http") &&
      ttlUrl.endsWith(".ttl")
    ) {
      setSubmittedUrl(ttlUrl);
    } else {
      alert("Please enter a valid .ttl file URL!");
    }
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "white",
          backgroundColor: "black",
          height: submittedUrl ? "auto" : "100vh",
        }}
      >
        <div style={{ position: "absolute", top: 10, right: 10, fontSize: 12 }}>
          Developed by :-{" "}
          <a
            href="https://rishijay.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            Rishijay Shrivastava
          </a>
        </div>
        <h2>Knowledge Graph Visualizer</h2>
        <input
          type="text"
          placeholder="Enter Turtle(.ttl) File URL"
          value={ttlUrl}
          onChange={(e) => setTtlUrl(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Load Graph
        </button>
      </div>
      {submittedUrl && <GraphRenderer ttlUrl={submittedUrl} />}
    </>
  );
};

export default App;
