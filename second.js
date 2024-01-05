// second.js

const { ipcRenderer } = require("electron");

function updateGeneratedImage(imagePath) {
  const generatedImage = document.getElementById("generated-image");
  generatedImage.src = imagePath;
}

ipcRenderer.on("update-generated-image", (event, imagePath) => {
  updateGeneratedImage(imagePath);
});

// Call the updateGeneratedImage function when the second window loads
window.addEventListener("DOMContentLoaded", () => {
  // Specify the directory where your images are stored
  const imageDirectory = "S:/AI-SCREENSHOT/result";

  // List all files in the directory
  ipcRenderer.send("request-latest-image", imageDirectory);
});

ipcRenderer.on("latest-image-reply", (event, latestImage) => {
  if (latestImage) {
    updateGeneratedImage(latestImage);
  }
});
