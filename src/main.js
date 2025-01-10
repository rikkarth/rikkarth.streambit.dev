import $ from "jquery";
import { marked } from "marked";
import { EditorHandler } from "./editor/editor_handler";
import {
    initializeTerminal as initializedTerminal,
    enableClickOnCommand,
} from "./terminal/terminal";
import introduction_md from "../assets/docs/introduction.md?raw";
import "./main.css";
import email_svg from "../assets/images/email-icon.svg?url";
import github_svg from "../assets/images/github-icon.svg?url";
import linkedin_svg from "../assets/images/linkedin-icon.svg?url";
import { renderMOTD } from "./terminal/commands";

function main() {
    const app = createApp();
    

    const termContainer = $("<div><div>").attr("id", "terminal");
    const terminal = createTerminal(termContainer);

    $("body")
        .append(header())
        .append(contacts())
        .append(routingBtns())
        .append(app.append(terminal)) // then app needs to be appended to the DOM to get the correct window.getComputedStyle values
        .append(footer());



    $("#routing-buttons #about-btn").on("click", () => {
        const child = app.children().get(0);

        if (child && child.className === "terminal") {
            app.empty();
        }

        if (child && child.className === "editor") {
            return;
        }

        const editorHandler = new EditorHandler();
        app.append(editorHandler.editor);
        const intro = marked.parse(introduction_md);
        editorHandler.update(intro);
    });

    $("#routing-buttons #terminal-btn").on("click", () => {
        const child = app.children().get(0);

        if (child && child.id === "terminal") {
            return;
        }
        
        app.empty();
        termContainer.empty();
        app.append(createTerminal(termContainer));
    });
}

function createApp() {
    const app = $("<div></div>").attr("id", "app");

    return app;
}

function createTerminal(container) {
    return initializedTerminal(container);
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
        .text("Home");

    routingBtns.append(terminalButton, aboutButton);

    return routingBtns;
}

function footer() {
    const footer = $("<footer></footer>");
    const paragraph = $("<p></p>").text("Hey! I'm being served from a ");
    const paragraph2 = $("<p></p>").text(
        "This page is still in construction but I'm always eager to push! 😂"
    );
    const span = $("<span></span>")
        .attr("id", "rasp")
        .append($("<strong></strong>").attr("id", "rasp").text("Raspberry Pi"));

    paragraph.append(span).append(".🙂");

    footer.append(paragraph, paragraph2);

    return footer;
}

$.ready(main());
