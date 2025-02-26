"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");

  useEffect(() => {
    socket.on("video-share", (data) => {
      setVideoUrl(data.url);
      console.log("Vidéo reçue :", data.url);
    });
    return () => {
      socket.off("video-share");
    };
  }, []);

  const shareVideo = () => {
    if (inputUrl) {
      socket.emit("video-share", { url: inputUrl });
      setVideoUrl(inputUrl); // Affiche dans la fenêtre émettrice aussi
      setInputUrl("");
    }
  };

  // Vérifie si l’URL est YouTube pour utiliser une iframe
  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1>Partage Vidéo SAAS en Temps Réel</h1>
      <input
        type="text"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="Entrez une URL vidéo (ex. YouTube)"
        style={{
          padding: "5px",
          width: "300px",
          margin: "10px",
          color: "#000000",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={shareVideo}
        style={{
          padding: "5px 10px",
          color: "#ffffff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Partager la Vidéo
      </button>
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Vidéo partagée :</h3>
          {isYouTube(videoUrl) ? (
            <iframe
              width="600"
              height="340"
              src={getYouTubeEmbedUrl(videoUrl)}
              title="Vidéo partagée"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoUrl} controls autoPlay width="600" />
          )}
        </div>
      )}
    </div>
  );
}
