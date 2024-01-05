//second.js

// Define updateGeneratedImage function outside of the DOMContentLoaded listener
function updateGeneratedImage(imagePath) {
  const generatedImage = document.getElementById("generated-image");
  if (generatedImage) {
    // Append a timestamp to the image source to avoid caching issues
    /*     const uniqueImagePath = imagePath + "?t=" + new Date().getTime();
     */ const uniqueImagePath = imagePath;
    generatedImage.src = uniqueImagePath;
  } else {
    console.error("Generated image element not found");
  }
}

// Use the exposed 'electron' object for IPC communication
electron.receive("latest-image-reply", (latestImage) => {
  // Inside electron.receive("latest-image-reply", ...) in second.js
  console.log("Received latest image path:", latestImage);

  if (latestImage) {
    updateGeneratedImage(latestImage);
  }
});

// Trigger an initial request for the latest image when the second window loads
window.addEventListener("DOMContentLoaded", (event) => {
  const imageDirectory = "S:/AI-SCREENSHOT/result";
  electron.send("request-latest-image", imageDirectory);
});
