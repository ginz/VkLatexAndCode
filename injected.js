// CONSTANTS section
var LATEX_URL_PREFIX = "https://latex.codecogs.com/png.latex?";
var FORMULA_PREFIX = "FORMULA: ";
var CODE_PREFIX = "CODE: ";
var TIMEOUT = 40; //ms
var DIALOG_WIDTH = 600;
// end of CONSTANTS section

var mediaItems = [];
var processedMessages = [];

function imageUrlByFormula(formula) {
    return LATEX_URL_PREFIX + escape(formula);
}

languages = hljs.listLanguages();

// CREATING FORMULA CREATION NODE section
var latexLink = document.createElement("a");
latexLink.id = "latex_link";
latexLink.innerHTML = "<nobr>LaTeX formula</nobr>";
latexLink.className = "add_media_item";
latexLink.style.backgroundImage = "url(" + formulaImageUrl + ")";
// end of CREATING FORMULA CREATION NODE section

// CREATING CODE SNIPPET NODE section
var codeLink = document.createElement("a");
codeLink.id = "code_link";
codeLink.innerHTML = "<nobr>Code snippet</nobr>";
codeLink.className = "add_media_item";
codeLink.style.backgroundImage = "url(" + codeImageUrl + ")";
//end of CREATE CODE SNIPPET NODE section

// FORMULA POPUP section
var formulaPopup = document.createElement("dialog");
formulaPopup.id = "formulaDialog";
formulaPopup.style.width = DIALOG_WIDTH + 'px';
formulaPopup.innerHTML =
"<form method='dialog'>" +
"<div id='toolbar'></div><br>" +
"<textarea id='latexInput' rows='3' cols='40'></textarea><br>" +
"<img id='equation' align='middle'><br>" +
"<input type='submit' value='Send formula' id='submitFormula'>" +
"<input type='reset' value='Cancel' id='cancelFormula'>" +
"</form>";
document.body.appendChild(formulaPopup);
document.getElementById("cancelFormula").onclick = function() {
    formulaPopup.close();
};
document.getElementById("submitFormula").onclick = function() {
    var formula = document.getElementById("latexInput").value;
    imageUrl = imageUrlByFormula(formula);

    var editableNode = document.getElementById("im_editable" + cur.id);
        
    var formulaCode = FORMULA_PREFIX + window.btoa(formula);
    editableNode.innerHTML = formulaCode + "<br>" + imageUrl;
      
    editableNode.click();
    editableNode.dispatchEvent(new Event("paste"));
};

latexLink.onclick = function () {
    formulaPopup.showModal();
};
// end of FORMULA POPUP section

var languagesList = document.createElement("datalist");
languagesList.id = "languagesList";
languages.forEach(function (lang) {
    var langElement = document.createElement("option");
    langElement.value = lang;
    languagesList.appendChild(langElement);
});
document.body.appendChild(languagesList);

// CODE POPUP section
var codePopup = document.createElement("dialog");
codePopup.id = "codeDialog";
codePopup.innerHTML =
"<form method='dialog'>" +
"<input list='languagesList' placeholder='Language' id='languageInput'><br>" +
"<table border='1'><tr><th>Code</th><th>Preview</th></tr>"+
"<tr><td><textarea cols='80' rows='40' id='codeInput'></textarea></td><td valign='top'><pre><code id='codePreview'></code></pre></td></tr></table><br>"+
"<input type='submit' value='Send code snippet' id='submitCode'>" +
"<input type='reset' value='Cancel' id='cancelCode'>" +
"</form>";
document.body.appendChild(codePopup);
document.getElementById("cancelCode").onclick = function() {
    codePopup.close();
};
document.getElementById("submitCode").onclick = function() {
    var code = document.getElementById("codeInput").value;
    var lang = document.getElementById("languageInput").value;

    var editableNode = document.getElementById("im_editable" + cur.id);
    
    editableNode.innerHTML = CODE_PREFIX + window.btoa(lang + ';' + code);;
    
    editableNode.click();
    editableNode.dispatchEvent(new Event("paste"));
};

codeLink.onclick = function () {
    codePopup.showModal();
};

var langNode = document.getElementById("languageInput");
var codeNode = document.getElementById("codeInput");
var previewNode = document.getElementById("codePreview");;
var updatePreview = function() {
    previewNode.className = langNode.value;
    previewNode.innerText = codeNode.value;
    hljs.highlightBlock(previewNode);
};

langNode.onchange = updatePreview;
langNode.onkeyup = updatePreview;
codeNode.onchange = updatePreview;
langNode.onkeyup = updatePreview;

[langNode, codeNode].forEach(
    function(node) {
        node.onchange = updatePreview;
        node.addEventListener("keyup", updatePreview);
    }
);
// end of CODE POPUP section

EqEditor.embed("toolbar");
EqEditor.add(new EqTextArea("equation", "latexInput"), false);

/**
 * turns messages, send by this application into beautiful blocks
 */
/*function processMessageNode(node) {
    var wrapper = node.parentNode;

    var text = node.firstChild;
    if (!text) continue;

    try {
        if (text.nodeType != Node.TEXT_NODE) continue;
    } catch (err) {
        // dunno, why the fuck, but this happens
        console.log("WTF: " + wrapper.innerHTML);
        throw err;
    }

    var content = text.textContent;
    if (!content.startsWith(FORMULA_PREFIX)) continue;

    var formula = window.atob(content.substring(FORMULA_PREFIX.length));
    var copyFormulaNode = document.createElement("input");
    copyFormulaNode.type = "button";
    copyFormulaNode.value = "Copy formula";
    copyFormulaNode.onclick = function(formula, nodeToClickOn) {
        prompt("You can copy LaTeX sources of formula from this field:", formula);
        nodeToClickOn.click();
   }.bind(this, formula, wrapper);

    var image = document.createElement("img");
    image.src = imageUrlByFormula(formula);

    wrapper.innerHTML = "";
    wrapper.appendChild(image);
    wrapper.appendChild(document.createElement("br"));
    wrapper.appendChild(copyFormulaNode);
}*/

function checkElements() { 
    var attachMapItems = document.querySelectorAll(".add_media_type_2_map");

    for (var i = 0; i < attachMapItems.length; ++i) {
        var node = attachMapItems[i];

        if (mediaItems.indexOf(node) > -1) continue;
        mediaItems.push(node);

        node.parentNode.insertBefore(latexLink, node);
        node.parentNode.insertBefore(codeLink, node);
    }

    var messagesTexts = document.querySelectorAll(".im_msg_text");

    for (var i = 0; i < messagesTexts.length; ++i) {
        var messageText = messagesTexts[i];
        var wrapper = messageText.parentNode;

        if (processedMessages.indexOf(wrapper) > -1) continue;

        var text = messageText.firstChild;
        if (!text) continue;
        processedMessages.push(wrapper);

        try {
            if (text.nodeType != Node.TEXT_NODE) continue;
        } catch (err) {
            // dunno, why the fuck, but this happens
            console.log("WTF: " + wrapper.innerHTML);
            throw err;
        }

        var content = text.textContent;
        if (content.startsWith(FORMULA_PREFIX)) {

            var formula = window.atob(content.substring(FORMULA_PREFIX.length));
            var copyFormulaNode = document.createElement("input");
            copyFormulaNode.type = "button";
            copyFormulaNode.value = "Copy formula";
            copyFormulaNode.onclick = function(formula, nodeToClickOn) {
                prompt("You can copy LaTeX sources of formula from this field:", formula);
                nodeToClickOn.click();

           }.bind(this, formula, wrapper);

            var image = document.createElement("img");
            image.src = imageUrlByFormula(formula);

            wrapper.innerHTML = "";
            wrapper.appendChild(image);
            wrapper.appendChild(document.createElement("br"));
            wrapper.appendChild(copyFormulaNode);

        } else if (content.startsWith(CODE_PREFIX)) {
            
            var langPlusCode = window.atob(content.substring(CODE_PREFIX.length));

            var delimiter = langPlusCode.indexOf(";");
            var lang = langPlusCode.substring(0, delimiter);
            var code = langPlusCode.substring(delimiter + 1);

            var codeNode = document.createElement("code");
            codeNode.className = lang;
            codeNode.innerText = code;
            var preNode = document.createElement("pre");
            preNode.appendChild(codeNode);


            hljs.highlightBlock(preNode);

            wrapper.innerHTML = "";
            wrapper.appendChild(preNode);
        }
    }
}

setInterval(checkElements, TIMEOUT);


/*var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation);
    });
});

var observerConfig = {attributes: true, childList: true, characterData: true};

observer.observe(document.getElementById("im_content"), observerConfig);

*/
