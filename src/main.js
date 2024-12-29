import { marked } from "marked";

import { EditorHandler } from "./editor_handler";
import description_md from "./docs/description.md?raw";
import introduction_md from "./docs/introduction.md?raw";
import "../assets/styles/style.css";

function main() {
  const app = document.querySelector("#app");
  const editorHandler = new EditorHandler(app);

  app.appendChild(description());
  app.appendChild(editorHandler.editor);

  const intro = marked.parse(introduction_md);

  editorHandler.update(intro);

  // Add resize event listener
  window.addEventListener("resize", () => {
    editorHandler.update(intro);
  });
}

function description() {
  const convertedMD = marked.parse(description_md);

  const div = document.createElement("div");
  div.setAttribute("class", "description");
  div.innerHTML = convertedMD;
  return div;
}

main();
