export const directories = {
    education: [
        "",
        "<white>education</white>",

        '* <a href="https://codeforall.com/" target="_blank">CodeForAll_</a> <yellow>"Fullstack Software Engineer and Computer Science Bootcamp"</yellow> 2022',
        '* <a href="../assets/images/1609638883183.jpg" target="_blank">Post-secondary - IEFP</a> <yellow>"Electronics, Automation and Control"</yellow> 2015-2017',
        "",
    ],
    projects: [
        "",
        "<white>Open Source projects</white>",
        [
            [
                "FasterXML/jackson-databind - Stream Support",
                "https://github.com/FasterXML/jackson-databind/pull/4709",
                "This contribution aims at adding Stream Support for Java Stream API by implementing a JacksonCollector which collects JsonNode and ArrayNode into an overarching jacskon related data structure (JsonNode)",
            ],
            [
                "Apache Commons Configuration - Configuration2",
                "https://github.com/apache/commons-configuration/commit/63435b214598bd7ed6c7b3f8f36fdc1feb7f075e",
                "The new feature implements the ability to test if a configuration contains a value which can be leveraged for multiple validation purposes.",
            ],
            [
                "JSON-java - org.json",
                "https://github.com/stleary/JSON-java",
                "I contributed with strict-mode implementation, issue support and also contributed with multiple unit-tests to a 20+ year old library which is used worldwide.",
            ],
        ].map(([name, url, description = ""]) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        "",
    ].flat(),
    skills: [
        "",
        "<white>languages</white>",
        [
            "Java",
            "Groovy",
            "Python",
            "JavaScript",
            "TypeScript",
            "Bash",
            "SQL",
            "C",
            "C++",
            "Rust",
        ].map((lang) => `* <lightblue>${lang}</lightblue>`),
        "",
        "<white>tools</white>",
        ["computers"].map((lib) => `* <lightblue>${lib}</lightblue>`),
        "",
    ].flat(),
};
