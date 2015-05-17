var formulaImageUrl = chrome.extension.getURL("formula.png");
var codeImageUrl = chrome.extension.getURL("code.png");

function scriptFromFile(file) {
    var script = document.createElement("script");
    script.src = chrome.extension.getURL(file);
    return script;
}

function scriptFromSource(source) {
    var script = document.createElement("script");
    script.textContent = source;
    return script;
}

function inject(scripts) {
    if (scripts.length === 0)
        return;
    var otherScripts = scripts.slice(1);
    var script = scripts[0];
    var onload = function() {
        script.parentNode.removeChild(script);
        inject(otherScripts);
    };
    if (script.src != "") {
        script.onload = onload;
        document.head.appendChild(script);
    } else {
        document.head.appendChild(script);
        onload();
    }
}

inject([
    scriptFromSource("var formulaImageUrl = '" + formulaImageUrl + "';"),
    scriptFromSource("var codeImageUrl = '" + codeImageUrl + "';"),
    scriptFromFile("EqEditor/eq_editor-lite-17.js"),
    scriptFromFile("EqEditor/eq_config.js"),
    scriptFromFile("highlight/highlight.pack.js"),
    scriptFromFile("injected.js")
]);

// function injectScript(source) {
// 	var script = document.createElement("script");
// 	script.innerText = source;
// 	document.body.appendChild(script);
// }

// function injectScriptFromFile(file) {
// 	var script = document.createElement("script");
// 	script.src = chrome.extension.getURL(file);
// 	document.body.appendChild(script);
// }



// injectScript("var formulaImageUrl = '" + formulaImageUrl + "';");
// injectScript("var codeImageUrl = '" + codeImageUrl + "';");


// injectScriptFromFile("EqEditor/eq_editor-lite-17.js");
// injectScriptFromFile("EqEditor/eq_config.js");
// injectScriptFromFile("highlight/highlight.pack.js");
// injectScriptFromFile("injected.js");
