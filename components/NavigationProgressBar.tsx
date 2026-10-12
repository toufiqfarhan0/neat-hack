"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname changes, complete loading smoothly
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept click on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only trigger for internal links that differ from current pathname
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !target.getAttribute("target") &&
        !target.getAttribute("download") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const targetPath = href.split("?")[0].split("#")[0];
        const currentPath = window.location.pathname;

        if (targetPath !== currentPath) {
          setLoading(true);
          setProgress(30);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // Increment progress gradually while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + (prev < 60 ? 20 : 10);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* TOP GLOWING PROGRESS BAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #16a34a, #22c55e, #4ade80)",
          boxShadow: "0 0 12px rgba(34, 197, 94, 0.8)",
          zIndex: 999999,
          transition: progress === 100 ? "width 0.2s ease, opacity 0.3s ease" : "width 0.15s ease",
          opacity: progress === 100 ? 0 : 1,
          pointerEvents: "none",
        }}
      />

      {/* CENTER OF THE SCREEN LOADING OVERLAY */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "opacity 0.25s ease",
          opacity: progress === 100 ? 0 : 1,
          pointerEvents: progress === 100 ? "none" : "auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "16px",
            padding: "32px 44px",
            boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
            maxWidth: "340px",
            animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Animated Spinner with Brand Logo */}
          <div
            style={{
              position: "relative",
              width: "52px",
              height: "52px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3.5px solid #f4f4f5",
                borderTopColor: "#16a34a",
                borderRightColor: "#22c55e",
                animation: "spin 0.75s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "10px",
                background: "#09090b",
                color: "#ffffff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.02em",
              }}
            >
              O
            </div>
          </div>

          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", letterSpacing: "-0.01em" }}>
              Loading View...
            </div>
            <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>
              Synchronizing state with Ovio engine
            </div>
          </div>

          {/* Mini progress tracker */}
          <div
            style={{
              width: "140px",
              height: "4px",
              background: "#f4f4f5",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#16a34a",
                transition: "width 0.15s ease",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
