"use client";
import { useRouter } from "next/navigation";
import React from "react";

const TalkToVetButton = () => {
  const navigate = useRouter();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginRight: "10px",
        }}
      >
        <button
          onClick={() => navigate.push("/FindAVet")}
          style={{
            position: "relative",
            backgroundColor: "#113F67",
            color: "white",
            padding: "0.5rem 3rem",
            borderRadius: "4rem",
            fontWeight: 600,
            fontSize: "1.125rem",
            boxShadow: "0 10px 25px rgba(0, 255, 255, 0.1)",
            border: "2px solid rgba(34, 211, 238, 0.5)",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(34, 211, 238, 0.25)";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "rgba(34, 211, 238, 1)";

            const overlay = e.currentTarget.querySelector(
              ".overlay"
            ) as HTMLElement | null;
            const text = e.currentTarget.querySelector(
              ".text"
            ) as HTMLElement | null;
            const iconWrapper = e.currentTarget.querySelector(
              ".icon-wrapper"
            ) as HTMLElement | null;

            if (overlay) overlay.style.opacity = "1";
            if (text) text.style.color = "white";
            if (iconWrapper)
              iconWrapper.style.boxShadow = "0 0 10px rgba(34, 211, 238, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(0, 255, 255, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.5)";

            const overlay = e.currentTarget.querySelector(
              ".overlay"
            ) as HTMLElement | null;
            const text = e.currentTarget.querySelector(
              ".text"
            ) as HTMLElement | null;
            const iconWrapper = e.currentTarget.querySelector(
              ".icon-wrapper"
            ) as HTMLElement | null;

            if (overlay) overlay.style.opacity = "0";
            if (text) text.style.color = "#ccfbf1";
            if (iconWrapper) iconWrapper.style.boxShadow = "none";
          }}
        >
          <div
            className="overlay"
            style={{
              position: "absolute",
              inset: "0",
              background:
                "linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(96, 165, 250, 0.2))",
              borderRadius: "1rem",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              zIndex: 1,
            }}
          >
            <div
              className="icon-wrapper"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(34, 211, 238, 0.2)",
                borderRadius: "50%",
                border: "1px solid rgba(34, 211, 238, 0.5)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Video Icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="video-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ width: "20px", height: "20px", color: "#22d3ee" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </div>

            <span
              className="text"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#ccfbf1",
                transition: "color 0.3s ease",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              Talk to a Vet
            </span>

            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#22d3ee",
                borderRadius: "9999px",
                animation: "ping 1.2s infinite",
              }}
            ></div>
          </div>
        </button>
      </div>

      {/* Ping Animation */}
      <style>
        {`
          @keyframes ping {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TalkToVetButton;
