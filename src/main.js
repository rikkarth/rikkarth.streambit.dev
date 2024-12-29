import description_md from "./docs/description.md?raw";
import introduction_md from "./docs/introduction.md?raw";
import { marked } from "marked";
import "../assets/styles/style.css";
import "../assets/styles/description.css";
import "../assets/styles/introduction.css";

function main() {
  document.querySelector("#app").innerHTML = description() + introduction();
}

function introduction() {
  const lines = introduction_md.split("\n");
  const spans = lines
    .filter((line, index) => filterOutLastEmptyLine(index, lines, line))
    .map((line) => `<span></span>`)
    .join("");

  return `<div class="editor">
          <div class="line-numbers">
            ${spans}
          </div>
          <textarea class="introduction">${introduction_md}</textarea>
          </div>
`;
}

function filterOutLastEmptyLine(index, lines, line) {
  // filter out the last empty line in the markdown file to avoid extra line in the editor
  return !(index === lines.length - 1 && line === "");
}

function description() {
  const convertedMD = marked.parse(description_md);

  return `
          <div class="description">
            ${convertedMD}
          </div>
`;
}

main();
