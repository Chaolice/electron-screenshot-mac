const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  dialog,
} = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
let win = null;

function createWindow() {
  win = new BrowserWindow({
    x: 2440,
    y: 20,
    width: 100,
    height: 300,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  // win.maximize();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("screenshot", (event, arg) => {
  //Removed window, and left only screen
  desktopCapturer.getSources({ types: ["screen"] }).then(async (sources) => {
    for (const source of sources) {
      console.log(source);
      if (source.name === "Screen 1") {
        win.webContents.send("SET_SOURCE", source.id);
        return;
      }
    }
  });
});

/* ipcMain.on("save-image", (event, imageData) => {
  // Show a save dialog
  dialog
    .showSaveDialog(win, {
      defaultPath: "S:/AI-SCREENSHOT/saved-image.jpg",
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }],
      promptToCreate: true,
    })
    .then((result) => {
      // result.filePath will contain the path selected by the user
      if (!result.canceled && result.filePath) {
        // Extract the base64 data
        const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

        // Write the file to the selected path
        fs.writeFile(result.filePath, base64Data, "base64", (err) => {
          if (err) {
            console.error("Error saving image:", err);
          } else {
            console.log("Image saved successfully!");
          }
        });
      }
    });
}); */
ipcMain.on("save-image", (event, imageData) => {
  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(
    "S:/AI-SCREENSHOT/saved-image.jpg",
    base64Data,
    "base64",
    (err) => {
      if (err) {
        console.error("Error saving image:", err);
      } else {
        console.log("Image saved successfully!");
      }
    }
  );
});
