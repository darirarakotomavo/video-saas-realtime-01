"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var socket_io_client_1 = require("socket.io-client");
var socket = socket_io_client_1["default"]("http://localhost:5000", { transports: ["websocket"] });
function Home() {
    var _a = react_1.useState(""), videoUrl = _a[0], setVideoUrl = _a[1];
    var _b = react_1.useState(""), inputUrl = _b[0], setInputUrl = _b[1];
    react_1.useEffect(function () {
        socket.on("video-share", function (data) {
            setVideoUrl(data.url);
            console.log("Vidéo reçue :", data.url);
        });
        return function () {
            socket.off("video-share");
        };
    }, []);
    var shareVideo = function () {
        if (inputUrl) {
            socket.emit("video-share", { url: inputUrl });
            setVideoUrl(inputUrl); // Affiche dans la fenêtre émettrice aussi
            setInputUrl("");
        }
    };
    // Vérifie si l’URL est YouTube pour utiliser une iframe
    var isYouTube = function (url) {
        return url.includes("youtube.com") || url.includes("youtu.be");
    };
    var getYouTubeEmbedUrl = function (url) {
        var _a;
        var videoId = ((_a = url.split("v=")[1]) === null || _a === void 0 ? void 0 : _a.split("&")[0]) || url.split("/").pop();
        return "https://www.youtube.com/embed/" + videoId;
    };
    return (React.createElement("div", { style: {
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f0f0f0"
        } },
        React.createElement("h1", null, "Partage Vid\u00E9o SAAS en Temps R\u00E9el"),
        React.createElement("input", { type: "text", value: inputUrl, onChange: function (e) { return setInputUrl(e.target.value); }, placeholder: "Entrez une URL vid\u00E9o (ex. YouTube)", style: {
                padding: "5px",
                width: "300px",
                margin: "10px",
                color: "#000000",
                backgroundColor: "#ffffff",
                border: "1px solid #ccc"
            } }),
        React.createElement("button", { onClick: shareVideo, style: {
                padding: "5px 10px",
                color: "#ffffff",
                backgroundColor: "#007bff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            } }, "Partager la Vid\u00E9o"),
        videoUrl && (React.createElement("div", { style: { marginTop: "20px" } },
            React.createElement("h3", null, "Vid\u00E9o partag\u00E9e :"),
            isYouTube(videoUrl) ? (React.createElement("iframe", { width: "600", height: "340", src: getYouTubeEmbedUrl(videoUrl), title: "Vid\u00E9o partag\u00E9e", frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true })) : (React.createElement("video", { src: videoUrl, controls: true, autoPlay: true, width: "600" }))))));
}
exports["default"] = Home;
