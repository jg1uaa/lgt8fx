#!/usr/bin/env node
const fs = require("fs"); //Load the filesystem module
const { execSync } = require("child_process");

const package = "package_lgt8fx_index.json";
const folder = "lgt8f";

const toNum = str => parseInt(str.split(".").join(""), 10);
const jsonStr = fs.readFileSync(package);
fs.writeFileSync(package + ".bak", jsonStr);

const json = JSON.parse(jsonStr);
const { platforms } = json.packages[0];
let lastVersion = "0.9.9";
for (const { version } of platforms) {
  if (toNum(version) > toNum(lastVersion)) {
    lastVersion = version;
  }
}

const newVersion = (toNum(lastVersion) + 1 + "").split("").join(".");

const archiveFileName = `${folder}-${newVersion}.zip`;
execSync(`zip -r ${archiveFileName} ${folder}`);
console.log(`zipped ${archiveFileName}`);
const size = fs.statSync(archiveFileName).size.toString();
console.log(`size ${size}`);
const checksum =
  "SHA-256:" +
  execSync(`shasum -a 256 ${archiveFileName}`)
    .toString()
    .split(" ")[0];
console.log(`checksum ${checksum}`);

platforms.unshift({
  name: "LGT8fx Boards",
  architecture: "avr",
  version: newVersion,
  category: "lgt8fx",
  url:
    "https://raw.githubusercontent.com/dbuezas/lgt8fx/master/" +
    archiveFileName,
  archiveFileName,
  checksum,
  size,
  help: {
    online: "https://github.com/dbuezas/LGT8fx/isues"
  },
  boards: [
    { name: "LGT8F328P-LQFP48 MiniEVB" },
    { name: "LGT8F328P-LQFP32 MiniEVB" },
    { name: "LGT8F328D" },
    { name: "LGT8F328D-SSOP20" },
    { name: "LGT8F88D-SSOP20" }
  ]
});

fs.writeFileSync(package, JSON.stringify(json, 0, 2));
