const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(file, isDev) {
    super({
      title: "SysTop",
      width: isDev ? 700 : 355,
      height: 600,
      icon: "./assets/icons/icon.png",
      resizable: isDev ? true : false,
      show: false,
      opacity: 0.9,
      backgroundColor: "white",
      webPreferences: {
        nodeIntegration: true,
      },
    });
    this.loadFile(file);

    if (isDev) {
      this.webContents.openDevTools();
    }
  }
}

module.exports = MainWindow;
