const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;
const { ipcRenderer } = require("electron");
const math = require("math");

let cpuoverload;
let alertFrequency;

ipcRenderer.on("settings.get", (e, settings) => {
  (cpuoverload = +settings.cpuoverload),
    (alertFrequency = +settings.alertFrequency);
  console.log(cpuoverload, alertFrequency);
});

// Set Model

setInterval(() => {
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
    document.getElementById("cpu-progress").style.width = info + "%";
    if (info >= cpuoverload) {
      document.getElementById("cpu-progress").style.background = "red";
    } else {
      document.getElementById("cpu-progress").style.background = "#30c88b";
    }
    if (info >= cpuoverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "CPU overload",
        body: `CPU is over ${cpuoverload}% `,
        icon: path.join(__dirname, "img", "icon.jpg"),
      });
      localStorage.setItem("lastNotify", +new Date());
    }
  });
  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText = info + "%";
  });
  const uptime = secondsToDhms(os.uptime());
  document.getElementById("sys").innerText = uptime;
}, 2000);

function secondsToDhms(sec) {
  sec = +sec;
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % 3600) * 24) / 3600;
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

function notifyUser(options) {
  new Notification(options.title, options);
}

document.getElementById("cpu-model").innerText = cpu.model();
document.getElementById("comp-name").innerText = os.hostname();
document.getElementById("os").innerText = `${os.type()}`;
mem.info().then((info) => {
  document.getElementById("mem-total").innerText = info.totalMemMb;
});

function runNotify(frequency) {
  if (localStorage.getItem("lastNotify" == null)) {
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / (1000 * 60));

  if (minutesPassed > frequency) {
    return true;
  } else {
    false;
  }
}
