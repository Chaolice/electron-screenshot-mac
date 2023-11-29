const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("screenshot").addEventListener("click", (e) => {
    ipcRenderer.send("screenshot", "ping");
  });
});

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          minWidth: screen.width * 2,
          maxWidth: screen.width * 2,
          minHeight: screen.height * 2,
          maxHeight: screen.height * 2,
        },
      },
    });
    handleStream(stream);
  } catch (e) {
    handleError(e);
  }
});

function handleStream(stream) {
  const video = document.querySelector("video");
  video.style.position = "absolute";
  video.style.top = "10000000000px";
  video.srcObject = stream;
  video.onloadedmetadata = (e) => {
    video.play();
    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.width = screen.width * 2;
    canvas.height = screen.height * 2;
    console.log(window.innerWidth, screen.width, screen.innerWidth);
    var ctx = canvas.getContext("2d");
    // Draw video on canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    // document.querySelector("img").style.width = screen.width + "px";
    // document.querySelector("img").style.height = screen.height + "px";
    // document.querySelector("img").src = image;

    ipcRenderer.send("save-image", image);
  };
}

function handleError(e) {
  console.log(e);
}
