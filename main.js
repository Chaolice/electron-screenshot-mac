const fetch = require("electron-fetch").default;

let win = null;
let secondWin = null;

const IP = "localhost";
//

const HASH = `1xoiykw9t0a`;

//
const LOCAL = `http://${IP}:8080`;
const API = `http://${IP}:7860/`;

const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  screen,
  dialog,
} = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

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

function createSecondWindow() {
  const secondScreen = screen.getAllDisplays()[1]; // Get the second screen

  secondWin = new BrowserWindow({
    x: secondScreen.bounds.x,
    y: secondScreen.bounds.y,
    width: secondScreen.bounds.width,
    height: secondScreen.bounds.height,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in this window
    },
  });

  secondWin.loadFile("second.html"); // Replace "second.html" with your HTML file
  ipcMain.on("request-latest-image", (event, imageDirectory) => {
    // List all files in the directory
    fs.readdir(imageDirectory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      // Filter image files with the correct extension (e.g., .jpg)
      const imageFiles = files.filter((file) => file.endsWith(".jpg"));

      // Sort the image files by timestamp (assuming filenames contain timestamps)
      imageFiles.sort((a, b) => {
        const timestampA = parseInt(a.match(/(\d{14})\.jpg/)[1]); // Extract and parse timestamp
        const timestampB = parseInt(b.match(/(\d{14})\.jpg/)[1]);
        return timestampB - timestampA; // Sort in descending order
      });

      // Take the latest image file
      const latestImage = imageFiles[0];

      if (latestImage) {
        const imagePath = path.join(imageDirectory, latestImage);

        // Send the latest image path as a reply
        event.reply("latest-image-reply", imagePath);
      }
    });
  });
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
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `S:/AI-SCREENSHOT/saved-image-${timestamp}.jpg`;

  fs.writeFile(fileName, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving image:", err);
    } else {
      console.log("Image saved successfully:", fileName);

      // Trigger the event to update the second window with the image path
      event.sender.send("update-second-window-image", fileName); // Use event.sender here

      // Move the ipcMain.emit call here
      ipcMain.emit("update-second-window-image", fileName);
    }
  });
  fetchAIGeneratedImage(base64Data, timestamp);

  // Remove the following line, as the emit should happen inside the callback
  // ipcMain.emit("update-second-window-image", fileName);
});

function fetchAIGeneratedImage(base64Data, timestamp) {
  OBJECT_TO_SEND = {
    data: [
      "task(rc9ay8r9o74fcu4)",
      0,
      "analog style flash camera",
      "",
      [],
      "",
      null,
      null,
      null,
      null,
      null,
      null,
      20,
      "DPM++ 2M Karras",
      4,
      0,
      "original",
      1,
      1,
      7,
      1.5,
      0.75,
      null,
      250,
      250,
      1,
      "Crop and resize",
      "Whole picture",
      32,
      "Inpaint masked",
      "",
      "",
      "",
      [],
      false,
      [],
      "",
      "None",
      false,
      "",
      0.8,
      -1,
      false,
      -1,
      0,
      0,
      0,
      null,
      null,
      null,
      "* `CFG Scale` should be 2 or lower.",
      true,
      true,
      "",
      "",
      true,
      50,
      true,
      1,
      0,
      false,
      4,
      0.5,
      "Linear",
      "None",
      '<p style="margin-bottom:0.75em">Recommended settings: Sampling Steps: 80-100, Sampler: Euler a, Denoising strength: 0.8</p>',
      128,
      8,
      ["left", "right", "up", "down"],
      1,
      0.05,
      128,
      4,
      "fill",
      ["left", "right", "up", "down"],
      false,
      false,
      "positive",
      "comma",
      0,
      false,
      false,
      "",
      '<p style="margin-bottom:0.75em">Will upscale the image by the selected scale factor; use width and height sliders to set tile size</p>',
      64,
      "None",
      2,
      "Seed",
      "",
      [],
      "Nothing",
      "",
      [],
      "Nothing",
      "",
      [],
      true,
      false,
      false,
      false,
      0,
      false,
      null,
      null,
      false,
      null,
      null,
      false,
      null,
      null,
      false,
      50,
      [
        {
          name: "S:\\03-PROGRAMS\\sd.webui\\webui\\outputs\\img2img-images\\2024-01-04\\00001-370911593.png",
          data: "http://localhost:7860/file=S:\\03-PROGRAMS\\sd.webui\\webui\\outputs\\img2img-images\\2024-01-04\\00001-370911593.png",
          is_file: true,
        },
        {
          name: "C:\\Users\\Mel\\AppData\\Local\\Temp\\gradio\\tmp5h_amgoa.png",
          data: "http://localhost:7860/file=C:\\Users\\Mel\\AppData\\Local\\Temp\\gradio\\tmp5h_amgoa.png",
          is_file: true,
        },
        {
          name: "C:\\Users\\Mel\\AppData\\Local\\Temp\\gradio\\tmpzosy_o3h.png",
          data: "http://localhost:7860/file=C:\\Users\\Mel\\AppData\\Local\\Temp\\gradio\\tmpzosy_o3h.png",
          is_file: true,
        },
      ],
      '{"prompt": "analog style flash camera", "all_prompts": ["analog style flash camera"], "negative_prompt": "", "all_negative_prompts": [""], "seed": 370911593, "all_seeds": [370911593], "subseed": 872979184, "all_subseeds": [872979184], "subseed_strength": 0, "width": 512, "height": 512, "sampler_name": "DPM++ 2M Karras", "cfg_scale": 7, "steps": 20, "batch_size": 1, "restore_faces": false, "face_restoration_model": null, "sd_model_name": "analog-diffusion-1.0", "sd_model_hash": "a9a1c90893", "sd_vae_name": null, "sd_vae_hash": null, "seed_resize_from_w": -1, "seed_resize_from_h": -1, "denoising_strength": 0.75, "extra_generation_params": {"ControlNet 0": "Module: canny, Model: control_canny-fp16 [e3fe7712], Weight: 0.25, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Threshold A: 100, Threshold B: 200, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important", "ControlNet 1": "Module: depth_midas, Model: control_depth-fp16 [400750f6], Weight: 1.8, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important"}, "index_of_first_image": 0, "infotexts": ["analog style flash camera\\nSteps: 20, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 370911593, Size: 512x512, Model hash: a9a1c90893, Model: analog-diffusion-1.0, Denoising strength: 0.75, ControlNet 0: \\"Module: canny, Model: control_canny-fp16 [e3fe7712], Weight: 0.25, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Threshold A: 100, Threshold B: 200, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important\\", ControlNet 1: \\"Module: depth_midas, Model: control_depth-fp16 [400750f6], Weight: 1.8, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important\\", Version: v1.6.0-2-g4afaaf8a"], "styles": [], "job_timestamp": "20240104012310", "clip_skip": 1, "is_using_inpainting_conditioning": false}',
      "<p>analog style flash camera<br>\nSteps: 20, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 370911593, Size: 512x512, Model hash: a9a1c90893, Model: analog-diffusion-1.0, Denoising strength: 0.75, ControlNet 0: &quot;Module: canny, Model: control_canny-fp16 [e3fe7712], Weight: 0.25, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Threshold A: 100, Threshold B: 200, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important&quot;, ControlNet 1: &quot;Module: depth_midas, Model: control_depth-fp16 [400750f6], Weight: 1.8, Resize Mode: Crop and Resize, Low Vram: False, Processor Res: 512, Guidance Start: 0, Guidance End: 1, Pixel Perfect: False, Control Mode: My prompt is more important&quot;, Version: v1.6.0-2-g4afaaf8a</p>",
      "<p class='comments'></p><div class='performance'><p class='time'>Time taken: <wbr><span class='measurement'>1 min. 11.8 sec.</span></p><p class='vram'><abbr title='Active: peak amount of video memory used during generation (excluding cached data)'>A</abbr>: <span class='measurement'>5.03 GB</span>, <wbr><abbr title='Reserved: total amout of video memory allocated by the Torch library '>R</abbr>: <span class='measurement'>5.25 GB</span>, <wbr><abbr title='System: peak amout of video memory allocated by all running programs, out of total capacity'>Sys</abbr>: <span class='measurement'>19.8/23.9883 GB</span> (82.4%)</p></div>",
    ],
    event_data: null,
    fn_index: 686,
    session_hash: HASH,
  };
  //update the session_hash with the right value

  OBJECT_TO_SEND["session_hash"] = HASH;

  if (base64Data != "") {
    const b64Img = base64Data;
    //TATATA à TESTER
    // set image
    OBJECT_TO_SEND.data[5] = b64Img;
    // set prompt
    OBJECT_TO_SEND.data[2] = "analog style camera";
    // set width
    OBJECT_TO_SEND.data[23] = parseInt(250);
    // set height
    OBJECT_TO_SEND.data[24] = parseInt(250);
  } else {
    // set prompt
    OBJECT_TO_SEND.data[1] = "analog style camera";
    // set width
    OBJECT_TO_SEND.data[9] = parseInt(250);
    // set height
    OBJECT_TO_SEND.data[10] = parseInt(250);
  }

  fetch(`${API}run/predict/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(OBJECT_TO_SEND),
  })
    .then((response) => response.json())
    .then((data) => {
      const imageName = data.data[0][0].name; // Adjust according to actual data structure
      const imagePath = `${API}file=${imageName}`;
      const aiFileName = `S:/AI-SCREENSHOT/result/generated-image-${timestamp}.jpg`;

      // Fetch the actual image from the provided path and save it
      fetch(imagePath)
        .then((imageResponse) => imageResponse.arrayBuffer())
        .then((buffer) => {
          fs.writeFile(aiFileName, Buffer.from(buffer), (err) => {
            if (err) {
              console.error("Error saving AI-generated image:", err);
            } else {
              console.log("AI-generated image saved successfully:", aiFileName);

              // Update the second window to display the AI-generated image
              if (secondWin) {
                secondWin.webContents.send(
                  "update-generated-image",
                  aiFileName
                );
              }
            }
          });
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Add this event listener in your main process
ipcMain.on("open-second-window", (event, arg) => {
  createSecondWindow();
});
// Add this code after saving the image in your main process
ipcMain.on("update-second-window-image", (event, imagePath) => {
  try {
    if (secondWin) {
      secondWin.webContents.send("update-generated-image", imagePath);
    } else {
      console.error("Second window not found.");
    }
  } catch (error) {
    console.error("Error updating second window:", error);
  }
});
