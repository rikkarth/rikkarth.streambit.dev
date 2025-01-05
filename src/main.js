import $ from "jquery";
import { marked } from "marked";
import { EditorHandler } from "./editor/editor_handler";
import { initializeTerminal } from "./terminal/terminal";
import introduction_md from "../assets/docs/introduction.md?raw";
import "./main.css";
import email_svg from "../assets/images/email-icon.svg?url";
import github_svg from "../assets/images/github-icon.svg?url";
import linkedin_svg from "../assets/images/linkedin-icon.svg?url";

function main() {
    const app = createApp();
    const editorHandler = new EditorHandler();
    app.append(editorHandler.editor); // editor needs to be appended to the app first

    $("body")
        .append(header())
        .append(contacts())
        .append(routingBtns())
        .append(app.append(createTerminal())) // then app needs to be appended to the DOM to get the correct window.getComputedStyle values
        .append(footer());

    const intro = marked.parse(introduction_md);
    editorHandler.update(intro);

    $("#routing-buttons #about-btn").on("click", () => {
        const child = app.children().get(0);

        if (child && child.className === "editor") {
            return;
        }

        app.empty();
        app.append(editorHandler.editor);
    });

    $("#routing-buttons #terminal-btn").on("click", () => {
        const child = app.children().get(0);

        if (child && child.className === "terminal") {
            return;
        }

        app.empty();
        app.append(createTerminal());
    });
}

function createApp() {
    const app = $("<div></div>").attr("id", "app");

    return app;
}

function createTerminal() {
    const terminalContainer = $("<div><div>").attr("id", "terminal");

    initializeTerminal(terminalContainer);

    return terminalContainer;
}

function header() {
    const header = $("<header></header>");

    const span1 = $("<span></span>").append(
        $("<strong></strong>").text("Ricardo Mendes")
    );

    const span2 = $("<span></span>").html(
        "Software Engineer @ <strong>Eidosmedia</strong>"
    );

    header.append(span1).append(span2);

    return header;
}

function contacts() {
    const contacts = $("<div></div>").attr("id", "contacts");

    const githubLink = $("<a></a>")
        .addClass("icon")
        .attr("href", "https://github.com/rikkarth")
        .attr("target", "_blank")
        .append($("<img>").attr("src", `${github_svg}`));

    const linkedinLink = $("<a></a>")
        .addClass("icon")
        .attr("href", "https://www.linkedin.com/in/ricardominamendes/")
        .attr("target", "_blank")
        .append($("<img>").attr("src", `${linkedin_svg}`));

    const emailLink = $("<a></a>")
        .addClass("icon")
        .attr("href", "mailto:ricardo.mendes@streambit.dev")
        .attr("target", "_blank")
        .append($("<img>").attr("src", `${email_svg}`));

    contacts.append(githubLink, linkedinLink, emailLink);

    return contacts;
}

function routingBtns() {
    const routingBtns = $("<div></div>").attr("id", "routing-buttons");

    const aboutButton = $("<button></button>")
        .attr("id", "about-btn")
        .text("About");

    const terminalButton = $("<button></button>")
        .attr("id", "terminal-btn")
        .text("Terminal");

    routingBtns.append(aboutButton, terminalButton);

    return routingBtns;
}

function footer() {
    const footer = $("<footer></footer>");
    const paragraph = $("<p></p>").text("Hey! I'm being served from a ");
    const span = $("<span></span>")
        .attr("id", "rasp")
        .append($("<strong></strong>").attr("id", "rasp").text("Raspberry Pi"));

    paragraph.append(span).append(".🙂");
    footer.append(paragraph);

    return footer;
}

$.ready(main());
