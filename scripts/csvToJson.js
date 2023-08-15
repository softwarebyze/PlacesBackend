import fs from "fs";

const turnCSVIntoJSON = (path) => {
  const data = fs.readFileSync(path, "utf8");
  const newData = removeSubstring(data, /\r/g);
  const lines = newData.split("\n");

  const keys = lines[0].split(",");
  const interests = lines.map((line, i) => {
    if (i === 0) return;
    const values = line.split(",");
    return keys.reduce((obj, key, i) => {
      obj[key] = values[i];
      return obj;
    }, {});
  });
  return interests.filter((int) => int);
};

const writeToFile = (path, data) => {
  const stringified = JSON.stringify(data);
  fs.writeFileSync(path, stringified);
};

const removeSubstring = (str, regex) => {
  const newString = str.replace(regex, "");
  return newString;
};

const interests = turnCSVIntoJSON("../interests.csv");
writeToFile("../interests.json", interests);
