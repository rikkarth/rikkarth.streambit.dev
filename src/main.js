import { marked } from "marked";
import { EditorHandler } from "./editor_handler";
import { initializeTerminal } from "./terminal";
import description_md from "./docs/description.md?raw";
import introduction_md from "./docs/introduction.md?raw";
import "../assets/styles/style.css";

function main() {
    const app = $("#app");
    const editorHandler = new EditorHandler(app);
    const terminal = createTerminal();

    // prettier-ignore
    app
        .append(description())
        .append(editorHandler.editor)
        .append(terminal);

    const intro = marked.parse(introduction_md);

    editorHandler.update(intro);
}

function createTerminal() {
    const terminalContainer = $("<div><div>").attr("id", "terminal");

    initializeTerminal(terminalContainer);

    return terminalContainer;
}

function description() {
    const convertedMD = marked.parse(description_md);

    const div = document.createElement("div");
    div.setAttribute("class", "description");
    div.innerHTML = convertedMD;
    return div;
}

main();
