function CCgetId(n) {
    return document.getElementById(n);
}

function CConchange(n, fn) {
    var a = CCgetId(n);
    if (a) a.onchange = fn;
}

function CConclick(n, fn) {
    var a = CCgetId(n);
    if (a) a.onclick = fn;
}

function setadvert() {
    var e = CCgetId('latex_formula');
    var x = e.offsetWidth;
    if (CCgetId('wrap').style.marginLeft == 'auto') x -= 170;
    CCgetId('advert').style.display = (x < 600 ? 'none' : 'block');
    CCgetId('wrap').style.marginLeft = (x < 600 ? 'auto' : '170px');
}
var nocookies = false;
var Cookie = {
    set: function(c_name, value, expiredays) {
        if (nocookies) return; {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        }
    },
    get: function(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return '';
    }
};
var URL = {
    get: function(type, default_val) {
        if (location.href.match(type + '=')) return location.href.split(type + '=')[1].split('&')[0];
        return default_val;
    }
};
var Opacity = {
    set: function(id, opacity) {
        var obj = CCgetId(id).style;
        obj.opacity = (opacity / 100);
        obj.MozOpacity = (opacity / 100);
        obj.KhtmlOpacity = (opacity / 100);
        obj.filter = "alpha(opacity=" + opacity + ")";
    },
    fade: function(id, opacStart, opacEnd, millisec) {
        speed = Math.round(millisec / 100);
        sgn = (opacStart > opacEnd) ? -1 : 1;
        count = sgn * (opacEnd - opacStart);
        // dginzburg change
        // for (i = 1; i < count; i++) setTimeout("Opacity.set('" + id + "'," + (i * sgn + opacStart) + ")", (i * speed));
        for (i = 1; i < count; i++) setTimeout(function (x) {
            Opacity.set(id, x * sgn + opacStart);
        }.bind(this, i), (i * speed));
    },
    fadeout: function(id) {
        if (CCgetId(id)) {
            this.fade(id, 100, 10, 800);
            // dginzburg change
            // setTimeout("CCgetId('" + id + "').style.display='none'", 800);
            setTimeout(function () {
                CCgetId(id).style.display = 'none';
            }, 800);
        }
    },
    fadein: function(id) {
        if (CCgetId(id)) {
            this.set(id, 20);
            CCgetId(id).style.display = 'block';
            this.fade(id, 20, 100, 800);
        }
    }
};
var Panel = {
    plock: null,
    ctimer: null,
    otimer: null,
    oid: null,
    timer: Array(),
    open: function(a) {
        if (a) {
            var id = a.id;
            if (this.timer[id] != '') {
                clearTimeout(this.timer[id]);
                this.timer[id] = '';
            }
            // dginzburg change
            // this.timer[id] = setTimeout("CCgetId('" + id + "').style.overflow='visible';", 200);
            this.timer[id] = setTimeout(function () {
                CCgetId(id).style.overflow='visible';
            }, 200);
        }
    },
    close: function(a) {
        if (a) {
            var id = a.id;
            if (this.timer[id] != '') {
                clearTimeout(this.timer[id]);
                this.timer[id] = '';
            }
            // dginzburg change
            // this.timer[id] = setTimeout("CCgetId('" + id + "').style.overflow='hidden';", 200);
            this.timer[id] = setTimeout(function () {
                CCgetId(id).style.overflow='hidden';
            }, 200);
        }
    },
    hoverdiv: null,
    hlock: false,
    hover: function(img, e) {
        if (this.hoverdiv) {
            this.lock = true;
            this.hoverdiv.innerHTML = '<img src="' + EQUATION_ENGINE + '/gif.latex?\\200dpi ' + img.latex + '"/>';
            if (document.all) {
                this.hoverdiv.style.top = (event.clientY - 10) + 'px';
                this.hoverdiv.style.left = (event.clientX + 20) + 'px';
            } else {
                if (!e) e = window.event;
                this.hoverdiv.style.top = (e.pageY - 10) + 'px';
                this.hoverdiv.style.left = (e.pageX + 20) + 'px';
            }
            this.hoverdiv.style.display = 'block';
            this.lock = false;
            img.onmouseout = Panel.hidehover;
        }
    },
    hidehover: function() {
        if (!this.hlock) CCgetId('hover').style.display = 'none';
    },
    init: function(hoverbox, editorid) {
        this.hoverdiv = CCgetId(hoverbox);
        var divElem;
        if (editorid !== undefined) divElem = document.getElementById(editorid);
        else divElem = document;
        var areas = divElem.getElementsByTagName('area');
        for (i = 0; i < areas.length; i++) {
            areas[i].onmouseover = function(e) {
                Panel.hover(this, e);
            };
            latex = areas[i].alt;
            areas[i].latex = latex;
            areas[i].alt = '';
            if (areas[i].title == '') areas[i].title = latex;
            if (areas[i].onclick == undefined) areas[i].onclick = function() {
                EqEditor.insert(this.latex);
            };
        }
        if (divElem.getElementsByClassName == undefined) {
            divElem.getElementsByClassName = function(className) {
                var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
                var allElements = divElem.getElementsByTagName("*");
                var results = [];
                var element;
                for (var i = 0;
                    (element = allElements[i]) != null; i++) {
                    var elementClass = element.className;
                    if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass)) results.push(element);
                }
                return results;
            }
        }
        var panels = divElem.getElementsByClassName('panel');
        for (i = 0; i < panels.length; i++)
            if (panels[i].id != '') {
                panels[i].onmouseover = function(e) {
                    Panel.open(this);
                };
                panels[i].onmouseout = function(e) {
                    Panel.close(this);
                };
            }
    }
};

function EqTextArea(preview, input, comment, download, intro) {
    this.changed = false;
    this.orgtxt = '';
    this.bArray_id = new Array();
    this.bArray_area = new Array();
    this.bArray_mode = new Array();
    this.bsize = 0;
    this.updateExportArea = function() {
        for (i = 0; i < this.bsize; i++) {
            var v = this.exportEquation(this.bArray_mode[i]);
            if (this.bArray_area[i].src !== undefined) this.bArray_area[i].src = v;
            else if (this.bArray_area[i].value !== undefined) this.bArray_area[i].value = v;
            else if (this.bArray_area[i].innerHTML !== undefined) this.bArray_area[i].innerHTML = v;
        }
    };
    this.addExportArea = function(textarea_id, mode) {
        var a = CCgetId(textarea_id);
        if (a) {
            this.bArray_id[this.bsize] = textarea_id;
            this.bArray_area[this.bsize] = a;
            this.bArray_mode[this.bsize] = mode;
            this.bsize++;
        }
    };
    this.changeExportArea = function(textarea_id, mode) {
        for (i = 0; i < this.bsize; i++) {
            if (textarea_id == this.bArray_id[i]) {
                this.bArray_mode[i] = mode;
                i = this.bsize;
            }
        }
    };
    this.myUndo = 0;
    this.myRedo = 0;
    this.store_text = new Array();
    this.store_text.push("");
    this.addEvent = function(action, fn) {
        if (this.equation_input.addEventListener) this.equation_input.addEventListener(action, fn, false);
        else this.equation_input.attachEvent('on' + action, fn);
    };
    this.set = function(preview, input, comment, download, intro) {
        if (preview == undefined || preview == '') preview = 'equationview';
        if (input == undefined || input == '') input = 'latex_formula';
        if (comment == undefined || comment == '') comment = 'equationcomment';
        if (download == undefined || download == '') download = 'download';
        if (intro == undefined || intro == '') intro = 'intro';
        this.equation_preview = CCgetId(preview);
        this.equation_input = CCgetId(input);
        this.equation_comment = CCgetId(comment);
        this.equation_download = CCgetId(download);
        this.intro_text = intro;
        if (this.equation_input) {
            this.addEvent('keydown', function(e) {
                Panel.close();
                EqEditor.countclick();
                EqEditor.tabHandler(e);
            });
            this.addEvent('keyup', function() {
                EqEditor.textchanged();
                EqEditor.autorenderEqn(10);
            });
            this.addEvent('keypress', function(e) {
                EqEditor.keyHandler(e);
            });
            if (CCgetId(this.intro_text)) {
                CCgetId(this.intro_text).onclick = function(e) {
                    EqEditor.targetArea.equation_input.focus();
                    Opacity.fadeout(this.intro_text);
                };
            }
        }
    };
    this.setText = function(val) {
        var latex = unescape(val.replace(/\&space;/g, ' ').replace(/\&plus;/g, '+').replace(/\&hash;/g, '#').replace(/\@plus;/g, '+').replace(/\@hash;/g, '#'));
        EqEditor.reset();
        var i, subtex, go;
        do {
            go = 0;
            latex = latex.replace(new RegExp("^[\\s]+", "g"), "");
            i = latex.indexOf(' ');
            var ii = latex.indexOf('}');
            if (ii != -1 && (ii < i || i == -1)) i = ii;
            if (i != -1) {
                subtex = latex.substr(0, i);
                if (EqEditor.setSelIndx('fontsize', subtex)) go = 1;
                if (subtex == '\\inline') {
                    CCgetId('inline').checked = true;
                    CCgetId('compressed').checked = true;
                    go = 1;
                }
                if (subtex.substr(0, 4) == '\\bg_' && EqEditor.setSelIndx('bg', subtex.substr(4))) go = 1;
                if (subtex.substr(0, 4) == '\\fn_' && EqEditor.setSelIndx('font', subtex.substr(4))) go = 1;
                if (subtex.substr(0, 5) == '\\dpi{' && EqEditor.setSelIndx('dpi', subtex.substr(5))) go = 1;
                if (go) latex = latex.substr(i + 1);
            }
        } while (go) if (latex.length > 0) {
            this.equation_input.value = latex;
            this.textchanged();
            this.renderEqn();
        }
    };
    this.clearText = function() {
        this.equation_input.value = "";
        this.equation_input.focus();
        this.changed = false;
        this.equation_preview.src = EDITOR_SRC + '/images/spacer.gif';
        Opacity.fadein(this.intro_text);
    };
    this.textchanged = function() {
        var txt = this.getEquationStr();
        if (txt.length == 0) Opacity.fadein(this.intro_text);
        else Opacity.fadeout(this.intro_text);
        if (txt != this.orgtxt) {
            this.orgtxt = txt;
            this.changed = true;
            return true;
        }
        return false;
    };
    this.auton = 0;
    this.renderCountdown = function() {
        if (this.auton > 0) {
            this.auton--;
            // dginzburg change
            // var fn = new Function(this.renderCountdown());
            setTimeout(this.renderCountdown(), 100);
        } else this.renderEqn(null);
    };
    this.autorenderEqn = function(n) {
        if (this.auton > 0 && n > 0) this.auton = n;
        else {
            this.auton = n;
            this.renderCountdown();
        }
    };
    this.insertText = function(txt, pos, inspos) {
        var key_text = '';
        if (pos == 1000) {
            pos = txt.length - 1;
        }
        if (pos == null) {
            pos = txt.indexOf('{') + 1;
            if (pos <= 0) {
                txt += ' ';
                pos = txt.length;
            } else {
                if (txt.charAt(pos) != '}') pos = txt.indexOf('}', pos) + 1;
            }
        }
        var insert_pos = (inspos == null) ? pos : inspos;
        var i;
        var myField = this.equation_input;
        var leftbracket = (txt.substring(1, 5) == "left");
        if (document.selection) {
            myField.focus();
            var sel = document.selection.createRange();
            i = this.equation_input.value.length + 1;
            var theCaret = sel.duplicate();
            while (theCaret.parentElement() == myField && theCaret.move("character", 1) == 1) --i;
            if ((leftbracket || insert_pos >= 0) && sel.text.length) {
                if (leftbracket) ins_point = 7;
                else ins_point = insert_pos;
                if (insert_pos == null) pos = txt.length + sel.text.length + 1;
                else if (insert_pos < pos) pos += sel.text.length;
                sel.text = txt.substring(0, ins_point) + sel.text + txt.substr(ins_point);
            } else sel.text = txt;
            var range = myField.createTextRange();
            range.collapse(true);
            pos = i + pos;
            pos -= myField.value.substr(0, pos).split("\n").length - 1;
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        } else {
            if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                var cursorPos = startPos + txt.length;
                if ((leftbracket || insert_pos >= 0) && endPos > startPos) {
                    if (leftbracket) ins_point = 7;
                    else ins_point = insert_pos;
                    if (insert_pos == null) pos = txt.length + endPos - startPos + 1;
                    else if (insert_pos < pos) pos += endPos - startPos;
                    txt = txt.substring(0, ins_point) + myField.value.substring(startPos, endPos) + txt.substr(ins_point);
                }
                myField.value = myField.value.substring(0, startPos) + txt + myField.value.substring(endPos, myField.value.length);
                myField.selectionStart = cursorPos;
                myField.selectionEnd = cursorPos;
                myField.focus();
                myField.setSelectionRange(startPos + pos, startPos + pos);
            } else myField.value += txt;
        }
        this.textchanged();
        this.autorenderEqn(10);
        Panel.close(null);
        myField.focus();
    };
    this.getLaTeX = function() {
        var a = this.equation_input.value.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
        if (a.length > 0) return EqEditor.getSize() + a;
        return '';
    };
    this.getEquationStr = function() {
        var a = this.getLaTeX();
        if (a.length > 0) return EqEditor.getCompressed() + EqEditor.getDPI() + EqEditor.getBG() + EqEditor.getFont() + a;
        return '';
    };
    this.exportMessage = function(text) {
        var a = CCgetId('exportmessage');
        if (a) a.innerHTML = text;
    };
    this.exportEquation = function(type) {
        var format = EqEditor.getFormat();
        switch (type) {
            case 'safe':
                return this.getEquationStr().replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');
                break;
            case 'encoded':
                return escape(this.getEquationStr()).replace(/\+/g, '&plus;');
                break;
            case 'wp':
                {
                    this.exportMessage('Wordpress markup for this equation is:');
                    return EqEditor.get_inline_wrap(this.getLaTeX(), '[latex]{$TEXT}[/latex]\n', '$latex {$TEXT}$ ');
                }
                break;
            case 'phpBB':
                {
                    this.exportMessage('PHP Bulletin Board markup for this equation is:');
                    return ('[tex]' + this.getLaTeX() + '[/tex]\n');
                }
                break;
            case 'tw':
                {
                    this.exportMessage('TiddlyWiki markup for this equation is:');
                    text = this.getEquationStr();
                    text = text.replace(/\[/g, '%5B');
                    text = text.replace(/\]/g, '%5D');
                    return ('[img[' + EQUATION_ENGINE + '/' + format + '.latex?' + text.replace(/#/g, '&hash;') + ']]');
                }
                break;
            case 'url':
                {
                    this.exportMessage('The URL link to this equation is:');
                    return (EQUATION_ENGINE + '/' + format + '.latex?' + this.exportEquation('safe'));
                }
                break;
            case 'urlencoded':
                {
                    this.exportMessage('The Encoded URL link to this equation is:');
                    return (EQUATION_ENGINE + '/' + format + '.latex?' + this.exportEquation('encoded'));
                }
                break;
            case 'pre':
                {
                    this.exportMessage('HTML code using pre-tags is:');
                    return EqEditor.get_inline_wrap(this.getLaTeX(), '<pre xml:lang="latex">{$TEXT}</pre>\n', '<code xml:lang="latex">{$TEXT}</code> ');
                }
                break;
            case 'doxygen':
                {
                    this.exportMessage('DOxygen markup for this equation is:');
                    return EqEditor.get_inline_wrap(this.getLaTeX(), '\\f[{$TEXT}\\f]\n', '\\f${$TEXT}\\f$ ');
                }
                break;
            case 'htmledit':
                {
                    this.exportMessage('HTML code to embed this equation into a web page is:');
                    var a = this.exportEquation('safe');
                    if (format == 'swf') return ('<a href="' + EDIT_ENGINE + '?latex=' + a + '" target="_blank">' + AC_FL_RunContent('codebase', EDITOR_SW_FLASH, 'width', '600', 'height', '100', 'src', (EQUATION_ENGINE + '/swf.latex?' + a), 'quality', 'high', 'pluginspage', EDITOR_SW_PLAYER, 'align', 'top', 'scale', 'showall', 'wmode', 'window', 'devicefont', 'false', 'bgcolor', '#ffffff', 'menu', 'true', 'allowFullScreen', 'true', 'movie', (EQUATION_ENGINE + '/swf.latex?' + text)) + '</a>');
                    else return ('<a href="' + EDIT_ENGINE + '?latex=' + a + '" target="_blank"><img src="' + EQUATION_ENGINE + '/' + format + '.latex?' + a + '" title="' + this.getLaTeX() + '" /></a>');
                }
                break;
            case 'html':
                {
                    this.exportMessage('HTML code to embed this equation into a web page is:');
                    var a = this.exportEquation('safe');
                    if (format == 'swf') return AC_FL_RunContent('codebase', EDITOR_SW_FLASH, 'width', '600', 'height', '100', 'src', (EQUATION_ENGINE + '/swf.latex?' + a), 'quality', 'high', 'pluginspage', EDITOR_SW_PLAYER, 'align', 'top', 'scale', 'showall', 'wmode', 'window', 'devicefont', 'false', 'bgcolor', '#ffffff', 'menu', 'true', 'allowFullScreen', 'true', 'movie', (EQUATION_ENGINE + '/swf.latex?' + a));
                    else return ('<img src="' + EQUATION_ENGINE + '/' + format + '.latex?' + a + '" title="' + this.getLaTeX() + '" />');
                }
                break;
            default:
                {
                    this.exportMessage('LaTeX markup for this equation is:');
                    return EqEditor.get_inline_wrap(this.getLaTeX(), '\\[{$TEXT}\\]\n', '\${$TEXT}\$ ');
                }
                break;
        }
        return text;
    };
    this.setdownload = function(text) {
        if (this.equation_download) this.equation_download.innerHTML = text;
    };
    this.setcomment = function(text) {
        if (this.equation_comment) this.equation_comment.innerHTML = text;
    };
    this.renderEqn = function(callback) {
        var val = this.equation_input.value;
        val = val.replace(/^\s+|\s+$/g, "");
        if (val.length == 0) return true;
        var bracket = 0;
        var i;
        for (i = 0; i < val.length; i++) {
            switch (val.charAt(i)) {
                case '{':
                    if (i == 0 || val[i - 1] != '\\') bracket++;
                    break;
                case '}':
                    if (i == 0 || val[i - 1] != '\\') bracket--;
                    break;
            }
        }
        if (bracket == 0) {
            if (CCgetId('renderbutton')) CCgetId('renderbutton').className = 'greybutton';
            var img = this.equation_preview;
            var val = this.exportEquation('encoded');
            var sval = val.replace(/"/g, '\\"');
            var format = EqEditor.getFormat();
            if (this.changed) {
                this.setcomment('');
                switch (format) {
                    case 'gif':
                    case 'png':
                    case 'svg':
                        img.src = EQUATION_ENGINE + '/' + format + '.latex?' + val;
                        this.setdownload('<a href="' + EQUATION_ENGINE + '/' + format + '.download?' + sval + '">Click here to Download Image (' + format.toUpperCase() + ')</a>');
                        break;
                    case 'pdf':
                        img.src = EQUATION_ENGINE + '/gif.latex?' + val;
                        this.setdownload('<a target="_blank" href="' + EQUATION_ENGINE + '/pdf.download?' + sval + '"><img src="images/pdf.jpg" width="30" height="30" align="middle" />Click here to Download Equation (PDF)</a>');
                        break;
                }
                this.updateExportArea();
            }
        } else {
            if (bracket < 0) this.setcomment("<br/><span class=\"orange\">You have more <strong>closed '}' brackets</strong> than open '{' brackets</span>");
            else this.setcomment("<br/><span class=\"orange\">You have more <strong>open '{' brackets</strong> than closed '}' brackets</span>");
        }
        this.changed = false;
    };
    this.clickval = 0;
    this.countclick = function() {
        var x = this.equation_input.value;
        this.clickval++;
        if (this.clickval >= 3) {
            this.clickval = 0;
            if (this.myUndo == 0 || this.store_text[this.myUndo] != x) {
                if (this.myUndo > 20) this.store_text.shift();
                else this.myUndo++;
                this.store_text[this.myUndo] = x;
            }
        }
        this.myRedo = 0;
    };
    this.undo = function(box) {
        if (this.myRedo == 0) {
            if (this.myUndo > 20) this.store_text.shift();
            else this.myUndo++;
            this.store_text[this.myUndo] = this.equation_input.value;
        }
        if (this.myRedo < this.myUndo) {
            this.myRedo++;
            if (this.myRedo == this.myUndo && CCgetId('undobutton')) CCgetId('undobutton').src = EDITOR_SRC + "/images/buttons/undo-x.gif";
            var a = CCgetId('redobutton');
            if (a) a.src = EDITOR_SRC + "/images/buttons/redo.gif";
        } else return;
        z = this.store_text.length - this.myRedo - 1;
        if (this.store_text[z]) this.equation_input.value = this.store_text[z];
        else this.equation_input.value = this.store_text[0];
        this.equation_input.focus();
    };
    this.redo = function(box) {
        if (this.myRedo > 0) {
            this.myRedo--;
            if (this.myRedo == 0 && CCgetId('redobutton')) CCgetId('redobutton').src = EDITOR_SRC + "/images/buttons/redo-x.gif";
            var a = CCgetId('undobutton');
            if (a) a.src = EDITOR_SRC + "/images/buttons/undo.gif";
        } else return;
        var z = this.store_text.length - this.myRedo - 1;
        if (this.store_text[z]) this.equation_input.value = this.store_text[z];
        else this.equation_input.value = this.store_text[0];
        this.equation_input.focus();
    };
    this.Export = function(fnobj, type) {
        Example.add_history(this.equation_input.value);
        Example.hide();
        fnobj(this.exportEquation(type));
    };
    this.load = function(val) {
        if (typeof val !== 'undefined') this.setText(val)
    };
    if (preview !== undefined) this.set(preview, input, comment, download, intro);
};
var gallery = null;
var Example = {
    lastbutton: null,
    load_json: function(file, text) {
        var old = CCgetId('load_json');
        if (old != null) {
            old.parentNode.removeChild(old);
            delete old;
        }
        var d = new Date();
        text = 'rand=' + d.getTime() + '&' + text;
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = FAVORITE_ENGINE + '/' + file + '?' + text;
        script.id = 'load_json';
        head.appendChild(script);
    },
    add_fav: function() {
        text = EqEditor.targetArea.getEquationStr();
        if (text != '') {
            this.load_json('favorite_json.php', 'sid=' + EqEditor.SID + '&add&eqn=' + escape(text.replace(/\+/g, "@plus;").replace(/#/g, '@hash;')));
            // dginzburg change
            // setTimeout('Example.show(null, \'fav\')', 200);
            setTimeout(function () {
                Example.show(null, 'fav')
            }, 200);
        }
    },
    del_fav: function(name) {
        this.load_json('favorite_json.php', 'sid=' + EqEditor.SID + '&delete=' + name);
        // dginzburg change
        // setTimeout('Example.show(null, \'fav\')', 200);
        setTimeout(function () {
                Example.show(null, 'fav')
        }, 200);
    },
    add_history: function(text) {
        if (text != '') {
            this.load_json('history_json.php', 'sid=' + EqEditor.SID + '&add&eqn=' + escape(text.replace(/\+/g, "@plus;").replace(/#/g, '@hash;')));
        }
    },
    show: function(button, group) {
        CCgetId('bar1').style.display = 'none';
        CCgetId('bar2').style.display = 'block';
        if (CCgetId('photos')) CCgetId('photos').innerHTML = '';
        if (button !== null) {
            if (this.lastbutton !== null) this.lastbutton.className = 'lightbluebutton';
            button.className = 'greybutton';
            this.lastbutton = button;
        }
        gallery = new Scroll();
        if (group == 'fav' || group == 'history') {
            var d = new Date();
            gallery.init('photos', 'leftarrow', 'rightarrow', 'overview', FAVORITE_ENGINE + '/example_json.php?fn=gallery&rand=' + d.getTime() + '&sid=' + EqEditor.SID);
        } else gallery.init('photos', 'leftarrow', 'rightarrow', 'overview', FAVORITE_ENGINE + '/example_json.php?fn=gallery');
        gallery.visible_num = 1;
        gallery.new_offset = 5;
        gallery.maxpanels = 1;
        gallery.set_width(600, 100, 60);
        gallery.set_subtext('&type=' + group);
        gallery.add_panel();
        gallery.setarrow();
        gallery.setoverview();
    },
    hide: function() {
        CCgetId('bar2').style.display = 'none';
        CCgetId('bar1').style.display = 'block';
        if (this.lastbutton !== null) this.lastbutton.className = 'lightbluebutton';
        this.lastbutton = null;
    }
};
var ExportButton = {
    bArray_id: new Array(),
    bArray_area: new Array(),
    bArray_mode: new Array(),
    bArray_fn: new Array(),
    bsize: 0,
    state: function(state) {
        for (i = 0; i < this.bsize; i++) {
            if (state) this.bArray_id[i].className = 'lightbluebutton';
            else this.bArray_id[i].className = 'greybutton';
        }
    },
    add: function(textarea, button_id, targetFn, mode) {
        var a = CCgetId(button_id);
        if (a) {
            this.bArray_id[this.bsize] = a;
            this.bArray_area[this.bsize] = textarea;
            this.bArray_mode[this.bsize] = mode;
            this.bArray_fn[this.bsize] = targetFn;
            a.onclick = function(e) {
                var i = this.exportid;
                ExportButton.bArray_area[i].Export(ExportButton.bArray_fn[i], ExportButton.bArray_mode[i]);
                window.close();
            };
            a.exportid = this.bsize;
            this.bsize++;
        }
    }
};
var EqEditor = {
    SID: 0,
    copy_button: null,
    key_text: '',
    format: 'gif',
    setSelIndx: function(id, v) {
        var s = CCgetId(id);
        if (s)
            for (var i = 0; i < s.options.length; i++) {
                if (s.options[i].value == v) {
                    s.options[i].selected = true;
                    return true;
                }
            }
        return false;
    },
    targetArray: new Array(),
    targetSize: 0,
    targetArea: null,
    curTarget: 0,
    changeExportArea: function(id, mode) {
        for (i = 0; i < this.targetSize; i++) this.targetArray[i].changeExportArea(id, mode);
    },
    autorenderEqn: function(n) {
        this.targetArea.autorenderEqn(n);
    },
    change: function(i) {
        if (i != this.curTarget) {
            this.curTarget = i;
            this.key_rext = '';
        }
        this.targetArea = this.targetArray[i];
    },
    add: function(obj, resize) {
        this.targetArray[this.targetSize] = obj;
        // dginzburg change
        // obj.equation_input.onfocus = new Function('EqEditor.change(' + this.targetSize + ');');
        obj.equation_input.onfocus = function (x) {
            EqEditor.change(x);
        }.bind(this, this.targetSize);
        if (resize) {
            // dginzburg change
            //if (window.addEventListener) window.addEventListener('resize', new Function('EqEditor.resize(' + this.targetSize + ');'), false);
            if (window.addEventListener) window.addEventListener('resize', function (x) {
                EqEditor.resize(x);
            }.bind(this, this.targetSize), false);
            // dginzburg change
            //else window.attachEvent('onresize', new Function('EqEditor.resize(' + this.targetSize + ');'));
            else window.attachEvent('onresize', function (x) {
                EqEditor.resize(x);
            }.bind(this, this.targetSize));
            EqEditor.resize(this.targetSize);
        }
        if (this.targetSize == 0) obj.equation_input.focus();
        this.targetSize++;
    },
    editor_id: null,
    embed: function(id, SID, design, language) {
        if (this.targetSize > 0) {
            this.targetArray = new Array();
            this.targetSize = 0;
            this.targetArea = null;
            this.curTarget = 0;
        }
        if (this.editor_id != id) {
            this.editor_id = id;
            // dginzburg change
            /*var url = EMBED_ENGINE + '?id=' + id + '&SID=' + SID + '&design=' + design;
            if (language != undefined && language != '') url += '&lang=' + language;
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", url);
            document.getElementsByTagName("head")[0].appendChild(fileref);*/

            // copied from downloaded document
            document.getElementById('toolbar').innerHTML = "﻿<div id=\"hover\"><\/div>\n<div id=\"EqnEditor\">\n<div id=\"bar1\" class=\"top\">\n\n<div class=\"toolbar_wrapper\"><div class=\"toolbar\" style=\"z-index:23\"><div class=\"panel\"><img id=\"undobutton\" src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/buttons\/undo-x.gif\" alt=\"undo\" title=\"undo\"\/>\n\t\t<img id=\"redobutton\" src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/buttons\/redo-x.gif\" alt=\"redo\" title=\"redo\"\/>\n\t\t<input type=\"button\" class=\"lightbluebutton\" onclick=\"EqEditor.clearText()\" value=\"Очистить\" title=\"Окно редактора станет чистым, как белый лист\"\/><\/div> <div class=\"panel\"><select title=\"Цвет в уравнении\" onchange=\"EqEditor.insert(this.value, this.value.length-1); this.selectedIndex=0\"><option value=\"\">Цвета...<\/option><option value=\"{\\color{Red} }\" style=\"color:Red\">Красный<\/option><option value=\"{\\color{Green} }\" style=\"color:Green\">Зелёный<\/option><option value=\"{\\color{Blue} }\" style=\"color:Blue\">Blue<\/option><option value=\"{\\color{Yellow} }\" style=\"color:Yellow\">Жёлтый<\/option><option value=\"{\\color{Cyan} }\" style=\"color:Cyan\">Бирюзовый<\/option><option value=\"{\\color{Magenta} }\" style=\"color:Magenta\">Лиловый<\/option><option value=\"{\\color{Teal} }\" style=\"color:Teal\">Сизый<\/option><option value=\"{\\color{Purple} }\" style=\"color:Purple\">Фиолетовый<\/option><option value=\"{\\color{DarkBlue} }\" style=\"color:DarkBlue\">Тёмно-синий<\/option><option value=\"{\\color{DarkRed} }\" style=\"color:DarkRed\">Тёмно-красный<\/option><option value=\"{\\color{Orange} }\" style=\"color:Orange\">Рыжий<\/option><option value=\"{\\color{DarkOrange} }\" style=\"color:DarkOrange\">Тёмно-рыжий<\/option><option value=\"{\\color{Golden} }\" style=\"color:Golden\">Золотистый<\/option><option value=\"{\\color{Pink} }\" style=\"color:Pink\">Розовый<\/option><option value=\"{\\color{DarkGreen} }\" style=\"color:DarkGreen\">Тёмно-зелёный<\/option><option value=\"{\\color{Orchid} }\" style=\"color:Orchid\">Орхидейный<\/option><option value=\"{\\color{Emerald} }\" style=\"color:Emerald\">Изумрудный<\/option><\/select><\/div><div class=\"panel\"><select title=\"Functions\" onchange=\"EqEditor.insert(this.value); this.selectedIndex=0;\">\n\t\t\t<option selected=\"selected\" value=\"\" style=\"color:#8080ff\">Functions&hellip;<\/option>\n\t\t\t<option value=\"\\displaystyle\">display style<\/option>\n\t\t\t<optgroup label=\"Trig\">\n\t\t\t<option value=\"\\sin\">sin<\/option>\n\t\t\t<option value=\"\\cos\">cos<\/option>\n\t\t\t<option value=\"\\tan\">tan<\/option>\n\t\t\t<option value=\"\\csc\">csc<\/option>\n\t\t\t<option value=\"\\sec\">sec<\/option>\n\t\t\t<option value=\"\\cot\">cot<\/option>\n\t\t\t<option value=\"\\sinh\">sinh<\/option>\n\t\t\t<option value=\"\\cosh\">cosh<\/option>\n\t\t\t<option value=\"\\tanh\">tanh<\/option>\n\t\t\t<option value=\"\\coth\">coth<\/option>\n\t\t\t<\/optgroup> \n\t\t\t<optgroup label=\"Inverse Trig\">\n\t\t\t<option value=\"\\arcsin\">arcsin<\/option>\n\t\t\t<option value=\"\\arccos\">arccos<\/option>\n\t\t\t<option value=\"\\arctan\">arctan<\/option> \n\t\t\t<option value=\"\\sin^{-1}\">sin-1<\/option>\n\t\t\t<option value=\"\\cos^{-1}\">cos-1<\/option>\n\t\t\t<option value=\"\\tan^{-1}\">tan-1<\/option> \n\t\t\t<option value=\"\\sinh^{-1}\">sinh-1<\/option>\n\t\t\t<option value=\"\\cosh^{-1}\">cosh-1<\/option>\n\t\t\t<option value=\"\\tanh^{-1}\">tanh-1<\/option> \n\t\t\t<\/optgroup> \n\t\t\t<optgroup label=\"Logs\">\n\t\t\t<option value=\"\\exp\">exp<\/option>\n\t\t\t<option value=\"\\lg\">lg<\/option>\n\t\t\t<option value=\"\\ln\">ln<\/option>\n\t\t\t<option value=\"\\log\">log<\/option>\n\t\t\t<option value=\"\\log_{e}\">log e<\/option>\n\t\t\t<option value=\"\\log_{10}\">log 10<\/option>\n\t\t\t<\/optgroup>\n\t\t\t<optgroup label=\"Limits\">\n\t\t\t<option value=\"\\lim\">limit<\/option>\n\t\t\t<option value=\"\\liminf\">liminf<\/option>\n\t\t\t<option value=\"\\limsup\">limsup<\/option>\n\t\t\t<option value=\"\\max\">maximum<\/option>\n\t\t\t<option value=\"\\min\">minimum<\/option>\n\t\t\t<option value=\"\\infty\">infinite<\/option> \t\t\t\n\t\t\t<\/optgroup>  \n\t\t\t<optgroup label=\"Operators\">\n\t\t\t<option value=\"\\arg\">arg<\/option>\n\t\t\t<option value=\"\\det\">det<\/option>\n\t\t\t<option value=\"\\dim\">dim<\/option>\n\t\t\t<option value=\"\\gcd\">gcd<\/option>\n\t\t\t<option value=\"\\hom\">hom<\/option>\n\t\t\t<option value=\"\\ker\">ker<\/option>\n\t\t\t<option value=\"\\Pr\">Pr<\/option>\n\t\t\t<option value=\"\\sup\">sup<\/option> \n\t\t\t<\/optgroup> \n\t\t<\/select><\/div> <div class=\"panel\"><input type=\"button\" class=\"lightbluebutton\" value=\"Примеры\" title=\"Часто используемые в различных отраслях науки уравнения\" onclick=\"Example.show(this,'algebra');\"\/><\/div> <div class=\"panel\"><input type=\"button\" class=\"lightbluebutton\" value=\"История действий\" title=\"Список недавно вводившихся уравнений\" onclick=\"Example.show(this,'history');\"\/><\/div> <div class=\"panel\"><input type=\"button\" class=\"lightbluebutton\" value=\"Избранное\" title=\"Список часто используемых и горячо любимых вами формул\" onclick=\"Example.show(this,'fav');\"\/>&nbsp;<img src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/add.gif\" width=\"11\" height=\"12\" onclick=\"Example.add_fav();\" alt=\"+\" title=\"Добавить текущее уравнение в избранное\"\/><\/div> <div class=\"panel\"><a href=\"https:\/\/en.wikipedia.org\/wiki\/Help:Formula\" target=\"_blank\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/icons\/i.gif\" alt=\"help\" title=\"help\" width=\"13\" height=\"13\" border=\"0\"\/><\/a><\/div> <\/div><\/div><div class=\"toolbar_wrapper\"><div class=\"toolbar\" style=\"z-index:22\"><div class=\"panel\" id=\"panel14\" style=\"height:23px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/style.gif\" width=\"106\" height=\"184\" border=\"0\" title=\"Style\" alt=\"Style Panel\" usemap=\"#style_map\" \/><map name=\"style_map\" id=\"style_map\"><area shape=\"rect\" alt=\"\\boldsymbol{\\alpha\\beta\\gamma123}\" title=\"Math Bold Greek\" coords=\"0,0,50,20\" onclick=\"EqEditor.insert('\\\\boldsymbol{}')\" \/><area shape=\"rect\" alt=\"\\mathbf{Abc123}\" title=\"Math Bold\" coords=\"0,23,50,43\" onclick=\"EqEditor.insert('\\\\mathbf{}')\" \/><area shape=\"rect\" alt=\"\\mathit{Abc123}\" title=\"Math Italic\" coords=\"0,46,50,66\" onclick=\"EqEditor.insert('\\\\mathit{}')\" \/><area shape=\"rect\" alt=\"\\mathrm{Abc123}\" title=\"Math Roman\" coords=\"0,69,50,89\" onclick=\"EqEditor.insert('\\\\mathrm{}')\" \/><area shape=\"rect\" alt=\"\\mathfrak{Abc123}\" title=\"Math Fraktur\" coords=\"0,92,50,112\" onclick=\"EqEditor.insert('\\\\mathfrak{}')\" \/><area shape=\"rect\" alt=\"\\mathbb{Abc123}\" title=\"Math Blackboard\" coords=\"0,115,50,135\" onclick=\"EqEditor.insert('\\\\mathbb{}')\" \/><area shape=\"rect\" alt=\"\\textup{Abc 123}\" title=\"Text Upright\" coords=\"53,0,103,20\" onclick=\"EqEditor.insert('\\\\textup{}')\" \/><area shape=\"rect\" alt=\"\\textbf{Abc 123}\" title=\"Text Bold\" coords=\"53,23,103,43\" onclick=\"EqEditor.insert('\\\\textbf{}')\" \/><area shape=\"rect\" alt=\"\\textit{Abc 123}\" title=\"Text Italic\" coords=\"53,46,103,66\" onclick=\"EqEditor.insert('\\\\textit{}')\" \/><area shape=\"rect\" alt=\"\\textrm{Abc 123}\" title=\"Text Roman\" coords=\"53,69,103,89\" onclick=\"EqEditor.insert('\\\\textrm{}')\" \/><area shape=\"rect\" alt=\"\\textsl{Abc 123}\" title=\"Text Slanted\" coords=\"53,92,103,112\" onclick=\"EqEditor.insert('\\\\textsl{}')\" \/><area shape=\"rect\" alt=\"\\texttt{Abc 123}\" title=\"Text Typewriter\" coords=\"53,115,103,135\" onclick=\"EqEditor.insert('\\\\texttt{}')\" \/><area shape=\"rect\" alt=\"\\textsc{Abc 123}\" title=\"Text Small Caps\" coords=\"53,138,103,158\" onclick=\"EqEditor.insert('\\\\textsc{}')\" \/><area shape=\"rect\" alt=\"\\emph{Abc 123}\" title=\"Text Emphasis\" coords=\"53,161,103,181\" onclick=\"EqEditor.insert('\\\\emph{}')\" \/><\/map><\/div><div class=\"panel\" id=\"panel13\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/spaces.gif\" width=\"31\" height=\"68\" border=\"0\" title=\"Spaces\" alt=\"Spaces Panel\" usemap=\"#spaces_map\" \/><map name=\"spaces_map\" id=\"spaces_map\"><area shape=\"rect\" alt=\"\\square\\underline{\\,}\\square\" title=\"thin space\" coords=\"0,0,28,14\" onclick=\"EqEditor.insert('\\\\,')\" \/><area shape=\"rect\" alt=\"\\square\\underline{\\:}\\square\" title=\"medium space\" coords=\"0,17,28,31\" onclick=\"EqEditor.insert('\\\\:')\" \/><area shape=\"rect\" alt=\"\\square\\underline{\\;}\\square\" title=\"thick space\" coords=\"0,34,28,48\" onclick=\"EqEditor.insert('\\\\;')\" \/><area shape=\"rect\" alt=\"\\square\\!\\square\" title=\"negative space\" coords=\"0,51,28,65\" onclick=\"EqEditor.insert('\\\\!')\" \/><\/map><\/div><div class=\"panel\" id=\"panel4\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/binary.gif\" width=\"68\" height=\"238\" border=\"0\" title=\"Binary\" alt=\"Binary Panel\" usemap=\"#binary_map\" \/><map name=\"binary_map\" id=\"binary_map\"><area shape=\"rect\" alt=\"\\pm\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\mp\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\times\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\ast\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\div\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\setminus\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\dotplus\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\amalg\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\dagger\" coords=\"0,136,14,150\"\/><area shape=\"rect\" alt=\"\\ddagger\" coords=\"0,153,14,167\"\/><area shape=\"rect\" alt=\"\\wr\" coords=\"0,170,14,184\"\/><area shape=\"rect\" alt=\"\\diamond\" coords=\"0,187,14,201\"\/><area shape=\"rect\" alt=\"\\circledcirc\" coords=\"0,204,14,218\"\/><area shape=\"rect\" alt=\"\\circledast\" coords=\"0,221,14,235\"\/><area shape=\"rect\" alt=\"\\cap\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\Cap\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\sqcap\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\wedge\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\barwedge\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\triangleleft\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\lozenge\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\circ\" coords=\"17,119,31,133\"\/><area shape=\"rect\" alt=\"\\square\" coords=\"17,136,31,150\"\/><area shape=\"rect\" alt=\"\\triangle\" coords=\"17,153,31,167\"\/><area shape=\"rect\" alt=\"\\triangledown\" coords=\"17,170,31,184\"\/><area shape=\"rect\" alt=\"\\ominus\" coords=\"17,187,31,201\"\/><area shape=\"rect\" alt=\"\\oslash\" coords=\"17,204,31,218\"\/><area shape=\"rect\" alt=\"\\circleddash\" coords=\"17,221,31,235\"\/><area shape=\"rect\" alt=\"\\cup\" coords=\"34,0,48,14\"\/><area shape=\"rect\" alt=\"\\Cup\" coords=\"34,17,48,31\"\/><area shape=\"rect\" alt=\"\\sqcup\" coords=\"34,34,48,48\"\/><area shape=\"rect\" alt=\"\\vee\" coords=\"34,51,48,65\"\/><area shape=\"rect\" alt=\"\\veebar\" coords=\"34,68,48,82\"\/><area shape=\"rect\" alt=\"\\triangleright\" coords=\"34,85,48,99\"\/><area shape=\"rect\" alt=\"\\blacklozenge\" coords=\"34,102,48,116\"\/><area shape=\"rect\" alt=\"\\bullet\" coords=\"34,119,48,133\"\/><area shape=\"rect\" alt=\"\\blacksquare\" coords=\"34,136,48,150\"\/><area shape=\"rect\" alt=\"\\blacktriangle\" coords=\"34,153,48,167\"\/><area shape=\"rect\" alt=\"\\blacktriangledown\" coords=\"34,170,48,184\"\/><area shape=\"rect\" alt=\"\\oplus\" coords=\"34,187,48,201\"\/><area shape=\"rect\" alt=\"\\otimes\" coords=\"34,204,48,218\"\/><area shape=\"rect\" alt=\"\\odot\" coords=\"34,221,48,235\"\/><area shape=\"rect\" alt=\"\\cdot\" coords=\"51,0,65,14\"\/><area shape=\"rect\" alt=\"\\uplus\" coords=\"51,17,65,31\"\/><area shape=\"rect\" alt=\"\\bigsqcup\" coords=\"51,34,65,48\"\/><area shape=\"rect\" alt=\"\\bigtriangleup\" coords=\"51,51,65,65\"\/><area shape=\"rect\" alt=\"\\bigtriangledown\" coords=\"51,68,65,82\"\/><area shape=\"rect\" alt=\"\\star\" coords=\"51,85,65,99\"\/><area shape=\"rect\" alt=\"\\bigstar\" coords=\"51,102,65,116\"\/><area shape=\"rect\" alt=\"\\bigcirc\" coords=\"51,119,65,133\"\/><area shape=\"rect\" alt=\"\\bigoplus\" coords=\"51,136,65,150\"\/><area shape=\"rect\" alt=\"\\bigotimes\" coords=\"51,153,65,167\"\/><area shape=\"rect\" alt=\"\\bigodot\" coords=\"51,170,65,184\"\/><\/map><\/div><div class=\"panel\" id=\"panel16\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/symbols.gif\" width=\"68\" height=\"136\" border=\"0\" title=\"Symbols\" alt=\"Symbols Panel\" usemap=\"#symbols_map\" \/><map name=\"symbols_map\" id=\"symbols_map\"><area shape=\"rect\" alt=\"\\therefore\" title=\"therefore\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\because\" title=\"because\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\cdots\" title=\"horizontal dots\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\ddots\" title=\"diagonal dots\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\vdots\" title=\"vertical dots\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\S\" title=\"section\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\P\" title=\"paragraph\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\copyright\" title=\"copyright\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\partial\" title=\"partial\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\imath\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\jmath\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\Re\" title=\"real\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\Im\" title=\"imaginary\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\forall\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\exists\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\top\" coords=\"17,119,31,133\"\/><area shape=\"rect\" alt=\"\\mathbb{P}\" title=\"prime\" coords=\"34,0,48,14\"\/><area shape=\"rect\" alt=\"\\mathbb{N}\" title=\"natural\" coords=\"34,17,48,31\"\/><area shape=\"rect\" alt=\"\\mathbb{Z}\" title=\"integers\" coords=\"34,34,48,48\"\/><area shape=\"rect\" alt=\"\\mathbb{I}\" title=\"irrational\" coords=\"34,51,48,65\"\/><area shape=\"rect\" alt=\"\\mathbb{Q}\" title=\"rational\" coords=\"34,68,48,82\"\/><area shape=\"rect\" alt=\"\\mathbb{R}\" title=\"real\" coords=\"34,85,48,99\"\/><area shape=\"rect\" alt=\"\\mathbb{C}\" title=\"complex\" coords=\"34,102,48,116\"\/><area shape=\"rect\" alt=\"\\angle\" coords=\"51,0,65,14\"\/><area shape=\"rect\" alt=\"\\measuredangle\" coords=\"51,17,65,31\"\/><area shape=\"rect\" alt=\"\\sphericalangle\" coords=\"51,34,65,48\"\/><area shape=\"rect\" alt=\"\\varnothing\" coords=\"51,51,65,65\"\/><area shape=\"rect\" alt=\"\\infty\" coords=\"51,68,65,82\"\/><area shape=\"rect\" alt=\"\\mho\" coords=\"51,85,65,99\"\/><area shape=\"rect\" alt=\"\\wp\" coords=\"51,102,65,116\"\/><\/map><\/div><div class=\"panel\" id=\"panel6\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/foreign.gif\" width=\"34\" height=\"136\" border=\"0\" title=\"Foreign\" alt=\"Foreign Panel\" usemap=\"#foreign_map\" \/><map name=\"foreign_map\" id=\"foreign_map\"><area shape=\"rect\" alt=\"\\aa\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\ae\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\l\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\o\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\oe\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\ss\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\$\" title=\"Dollar\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\cent\" title=\"Cent\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\AA\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\AE\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\L\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\O\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\OE\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\SS\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\pounds\" title=\"Pound\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\euro\" title=\"Euro\" coords=\"17,119,31,133\"\/><\/map><\/div><div class=\"panel\" id=\"panel15\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/subsupset.gif\" width=\"34\" height=\"153\" border=\"0\" title=\"Subsupset\" alt=\"Subsupset Panel\" usemap=\"#subsupset_map\" \/><map name=\"subsupset_map\" id=\"subsupset_map\"><area shape=\"rect\" alt=\"\\sqsubset\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\sqsubseteq\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\subset\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\subseteq\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\nsubseteq\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\subseteqq\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\nsubseteq\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\in\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\notin\" coords=\"0,136,14,150\"\/><area shape=\"rect\" alt=\"\\sqsupset\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\sqsupseteq\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\supset\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\supseteq\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\nsupseteq\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\supseteqq\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\nsupseteqq\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\ni\" coords=\"17,119,31,133\"\/><\/map><\/div><div class=\"panel\" id=\"panel1\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/accents.gif\" width=\"34\" height=\"119\" border=\"0\" title=\"Accents\" alt=\"Accents Panel\" usemap=\"#accents_map\" \/><map name=\"accents_map\" id=\"accents_map\"><area shape=\"rect\" alt=\"a'\" coords=\"0,0,14,14\" onclick=\"EqEditor.insert('{}\\'')\" \/><area shape=\"rect\" alt=\"\\dot{a}\" coords=\"0,17,14,31\" onclick=\"EqEditor.insert('\\\\dot{}')\" \/><area shape=\"rect\" alt=\"\\hat{a}\" coords=\"0,34,14,48\" onclick=\"EqEditor.insert('\\\\hat{}')\" \/><area shape=\"rect\" alt=\"\\grave{a}\" coords=\"0,51,14,65\" onclick=\"EqEditor.insert('\\\\grave{}')\" \/><area shape=\"rect\" alt=\"\\tilde{a}\" coords=\"0,68,14,82\" onclick=\"EqEditor.insert('\\\\tilde{}')\" \/><area shape=\"rect\" alt=\"\\bar{a}\" coords=\"0,85,14,99\" onclick=\"EqEditor.insert('\\\\bar{}')\" \/><area shape=\"rect\" alt=\"\\not{a}\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"a''\" coords=\"17,0,31,14\" onclick=\"EqEditor.insert('{}\\'\\'')\" \/><area shape=\"rect\" alt=\"\\ddot{a}\" coords=\"17,17,31,31\" onclick=\"EqEditor.insert('\\\\ddot{}')\" \/><area shape=\"rect\" alt=\"\\check{a}\" coords=\"17,34,31,48\" onclick=\"EqEditor.insert('\\\\check{}')\" \/><area shape=\"rect\" alt=\"\\acute{a}\" coords=\"17,51,31,65\" onclick=\"EqEditor.insert('\\\\acute{}')\" \/><area shape=\"rect\" alt=\"\\breve{a}\" coords=\"17,68,31,82\" onclick=\"EqEditor.insert('\\\\breve{}')\" \/><area shape=\"rect\" alt=\"\\vec{a}\" coords=\"17,85,31,99\" onclick=\"EqEditor.insert('\\\\vec{}')\" \/><area shape=\"rect\" alt=\"a^{\\circ}\" title=\"degrees\" coords=\"17,102,31,116\" onclick=\"EqEditor.insert('^{\\\\circ}',0)\" \/><\/map><\/div><div class=\"panel\" id=\"panel2\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/accents_ext.gif\" width=\"25\" height=\"170\" border=\"0\" title=\"Accents_ext\" alt=\"Accents_ext Panel\" usemap=\"#accents_ext_map\" \/><map name=\"accents_ext_map\" id=\"accents_ext_map\"><area shape=\"rect\" alt=\"\\widetilde{abc}\" coords=\"0,0,22,14\" onclick=\"EqEditor.insert('\\\\widetilde{}',11)\" \/><area shape=\"rect\" alt=\"\\widehat{abc}\" coords=\"0,17,22,31\" onclick=\"EqEditor.insert('\\\\widehat{}',9)\" \/><area shape=\"rect\" alt=\"\\overleftarrow{abc}\" coords=\"0,34,22,48\" onclick=\"EqEditor.insert('\\\\overleftarrow{}',15)\" \/><area shape=\"rect\" alt=\"\\overrightarrow{abc}\" coords=\"0,51,22,65\" onclick=\"EqEditor.insert('\\\\overrightarrow{}',16)\" \/><area shape=\"rect\" alt=\"\\overline{abc}\" coords=\"0,68,22,82\" onclick=\"EqEditor.insert('\\\\overline{}',10)\" \/><area shape=\"rect\" alt=\"\\underline{abc}\" coords=\"0,85,22,99\" onclick=\"EqEditor.insert('\\\\underline{}',11)\" \/><area shape=\"rect\" alt=\"\\overbrace{abc}\" coords=\"0,102,22,116\" onclick=\"EqEditor.insert('\\\\overbrace{}',11)\" \/><area shape=\"rect\" alt=\"\\underbrace{abc}\" coords=\"0,119,22,133\" onclick=\"EqEditor.insert('\\\\underbrace{}',12)\" \/><area shape=\"rect\" alt=\"\\overset{a}{abc}\" coords=\"0,136,22,150\" onclick=\"EqEditor.insert('\\\\overset{}{}',9,11)\" \/><area shape=\"rect\" alt=\"\\underset{a}{abc}\" coords=\"0,153,22,167\" onclick=\"EqEditor.insert('\\\\underset{}{}',10,12)\" \/><\/map><\/div><div class=\"panel\" id=\"panel3\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/arrows.gif\" width=\"56\" height=\"170\" border=\"0\" title=\"Arrows\" alt=\"Arrows Panel\" usemap=\"#arrows_map\" \/><map name=\"arrows_map\" id=\"arrows_map\"><area shape=\"rect\" alt=\"x \\mapsto x^2\" title=\"\\mapsto\" coords=\"0,0,25,14\"\/><area shape=\"rect\" alt=\"\\leftarrow\" coords=\"0,17,25,31\"\/><area shape=\"rect\" alt=\"\\Leftarrow\" coords=\"0,34,25,48\"\/><area shape=\"rect\" alt=\"\\leftrightarrow\" coords=\"0,51,25,65\"\/><area shape=\"rect\" alt=\"\\leftharpoonup\" coords=\"0,68,25,82\"\/><area shape=\"rect\" alt=\"\\leftharpoondown\" coords=\"0,85,25,99\"\/><area shape=\"rect\" alt=\"\\leftrightharpoons\" coords=\"0,102,25,116\"\/><area shape=\"rect\" alt=\"\\xleftarrow[text]{long}\" coords=\"0,119,25,133\" onclick=\"EqEditor.insert('\\\\xleftarrow[]{}',12)\" \/><area shape=\"rect\" alt=\"\\overset{a}{\\leftarrow}\" coords=\"0,136,25,150\" onclick=\"EqEditor.insert('\\\\overset{}{\\\\leftarrow}',9)\" \/><area shape=\"rect\" alt=\"\\underset{a}{\\leftarrow}\" coords=\"0,153,25,167\" onclick=\"EqEditor.insert('\\\\underset{}{\\\\leftarrow}',10)\" \/><area shape=\"rect\" alt=\"n \\to\" coords=\"28,0,53,14\"\/><area shape=\"rect\" alt=\"\\rightarrow\" coords=\"28,17,53,31\"\/><area shape=\"rect\" alt=\"\\Rightarrow\" coords=\"28,34,53,48\"\/><area shape=\"rect\" alt=\"\\Leftrightarrow\" coords=\"28,51,53,65\"\/><area shape=\"rect\" alt=\"\\rightharpoonup\" coords=\"28,68,53,82\"\/><area shape=\"rect\" alt=\"\\rightharpoondown\" coords=\"28,85,53,99\"\/><area shape=\"rect\" alt=\"\\rightleftharpoons\" coords=\"28,102,53,116\"\/><area shape=\"rect\" alt=\"\\xrightarrow[text]{long}\" coords=\"28,119,53,133\" onclick=\"EqEditor.insert('\\\\xrightarrow[]{}',13)\" \/><area shape=\"rect\" alt=\"\\overset{a}{\\rightarrow}\" coords=\"28,136,53,150\" onclick=\"EqEditor.insert('\\\\overset{}{\\\\rightarrow}',9)\" \/><area shape=\"rect\" alt=\"\\underset{a}{\\rightarrow}\" coords=\"28,153,53,167\" onclick=\"EqEditor.insert('\\\\underset{}{\\\\rightarrow}',10)\" \/><\/map><\/div><\/div><\/div><div class=\"toolbar_wrapper\"><div class=\"toolbar\" style=\"z-index:21\"><div class=\"panel\" id=\"panel11\" style=\"height:28px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/operators.gif\" width=\"168\" height=\"140\" border=\"0\" title=\"Operators\" alt=\"Operators Panel\" usemap=\"#operators_map\" \/><map name=\"operators_map\" id=\"operators_map\"><area shape=\"rect\" alt=\"x^a\" title=\"superscript\" coords=\"0,0,25,25\" onclick=\"EqEditor.insert('^{}',2,0)\" \/><area shape=\"rect\" alt=\"x_a\" title=\"subscript\" coords=\"0,28,25,53\" onclick=\"EqEditor.insert('_{}',2,0)\" \/><area shape=\"rect\" alt=\"x_a^b\" coords=\"0,56,25,81\" onclick=\"EqEditor.insert('_{}^{}',2,0)\" \/><area shape=\"rect\" alt=\"{x_a}^b\" coords=\"0,84,25,109\" onclick=\"EqEditor.insert('{_{}}^{}',1)\" \/><area shape=\"rect\" alt=\"_a^{b}\\textrm{C}\" title=\"_{a}^{b}\\textrm{C}\" coords=\"0,112,25,137\" onclick=\"EqEditor.insert('_{}^{}\\\\textrm{}',2,14)\" \/><area shape=\"rect\" alt=\"\\frac{a}{b}\" title=\"fraction\" coords=\"28,0,53,25\" onclick=\"EqEditor.insert('\\\\frac{}{}',6)\" \/><area shape=\"rect\" alt=\"x\\tfrac{a}{b}\" title=\"tiny fraction\" coords=\"28,28,53,53\" onclick=\"EqEditor.insert('\\\\tfrac{}{}',7)\" \/><area shape=\"rect\" alt=\"\\frac{\\partial }{\\partial x}\" coords=\"28,56,53,81\" onclick=\"EqEditor.insert('\\\\frac{\\\\partial }{\\\\partial x}',15)\" \/><area shape=\"rect\" alt=\"\\frac{\\partial^2 }{\\partial x^2}\" coords=\"28,84,53,109\" onclick=\"EqEditor.insert('\\\\frac{\\\\partial^2 }{\\\\partial x^2}',17)\" \/><area shape=\"rect\" alt=\"\\frac{\\mathrm{d} }{\\mathrm{d} x}\" coords=\"28,112,53,137\" onclick=\"EqEditor.insert('\\\\frac{\\\\mathrm{d} }{\\\\mathrm{d} x}',17)\" \/><area shape=\"rect\" alt=\"\\int\" coords=\"56,0,81,25\"\/><area shape=\"rect\" alt=\"\\int_a^b\" title=\"\\int_{}^{}\" coords=\"56,28,81,53\" onclick=\"EqEditor.insert('\\\\int_{}^{}',6,1000)\" \/><area shape=\"rect\" alt=\"\\oint\" coords=\"56,56,81,81\" onclick=\"EqEditor.insert('\\\\oint')\" \/><area shape=\"rect\" alt=\"\\oint_a^b\" title=\"\\oint_{}^{}\" coords=\"56,84,81,109\" onclick=\"EqEditor.insert('\\\\oint_{}^{}',7,1000)\" \/><area shape=\"rect\" alt=\"\\iint_a^b\" title=\"\\iint_{}^{}\" coords=\"56,112,81,137\" onclick=\"EqEditor.insert('\\\\iint_{}^{}',7,1000)\" \/><area shape=\"rect\" alt=\"\\bigcap\" coords=\"84,0,109,25\"\/><area shape=\"rect\" alt=\"\\bigcap_a^b\" title=\"\\bigcap_{}^{}\" coords=\"84,28,109,53\" onclick=\"EqEditor.insert('\\\\bigcap_{}^{}',9,1000)\" \/><area shape=\"rect\" alt=\"\\bigcup\" coords=\"84,56,109,81\" onclick=\"EqEditor.insert('\\\\bigcup')\" \/><area shape=\"rect\" alt=\"\\bigcup_a^b\" title=\"\\bigcup_{}^{}\" coords=\"84,84,109,109\" onclick=\"EqEditor.insert('\\\\bigcup_{}^{}',9,1000)\" \/><area shape=\"rect\" alt=\"\\displaystyle \\lim_{x \\to 0}\" title=\"\\lim_{x \\to 0}\" coords=\"84,112,109,137\" onclick=\"EqEditor.insert('\\\\lim_{}')\" \/><area shape=\"rect\" alt=\"\\sum\" coords=\"112,0,137,25\"\/><area shape=\"rect\" alt=\"\\sum_a^b\" title=\"\\sum_{}^{}\" coords=\"112,28,137,53\" onclick=\"EqEditor.insert('\\\\sum_{}^{}',6)\" \/><area shape=\"rect\" alt=\"\\sqrt{x}\" title=\"\\sqrt{}\" coords=\"112,56,137,81\" onclick=\"EqEditor.insert('\\\\sqrt{}',6,6)\" \/><area shape=\"rect\" alt=\"\\sqrt[n]{x}\" title=\"\\sqrt[]{}\" coords=\"112,84,137,109\" onclick=\"EqEditor.insert('\\\\sqrt[]{}',6,8)\" \/><area shape=\"rect\" alt=\"\\prod\" coords=\"140,0,165,25\"\/><area shape=\"rect\" alt=\"\\prod_a^b\" title=\"\\prod_{}^{}\" coords=\"140,28,165,53\" onclick=\"EqEditor.insert('\\\\prod_{}^{}',7,1000)\" \/><area shape=\"rect\" alt=\"\\coprod\" coords=\"140,56,165,81\"\/><area shape=\"rect\" alt=\"\\coprod_a^b\" title=\"\\coprod_{}^{}\" coords=\"140,84,165,109\" onclick=\"EqEditor.insert('\\\\coprod_{}^{}',9,1000)\" \/><\/map><\/div><div class=\"panel\" id=\"panel5\" style=\"height:28px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/brackets.gif\" width=\"56\" height=\"140\" border=\"0\" title=\"Brackets\" alt=\"Brackets Panel\" usemap=\"#brackets_map\" \/><map name=\"brackets_map\" id=\"brackets_map\"><area shape=\"rect\" alt=\"\\left (\\: \\right )\" title=\"\\left ( \\right )\" coords=\"0,0,25,25\" onclick=\"EqEditor.insert('\\\\left (  \\\\right )',8)\" \/><area shape=\"rect\" alt=\"\\left [\\: \\right ]\" title=\"\\left ( \\right )\" coords=\"0,28,25,53\" onclick=\"EqEditor.insert('\\\\left [  \\\\right ]',8)\" \/><area shape=\"rect\" alt=\"\\left\\{\\: \\right\\}\" title=\"\\left\\{ \\right\\}\" coords=\"0,56,25,81\" onclick=\"EqEditor.insert('\\\\left \\\\{  \\\\right \\\\}',9)\" \/><area shape=\"rect\" alt=\"\\left |\\: \\right |\" title=\"\\left | \\right |\" coords=\"0,84,25,109\" onclick=\"EqEditor.insert('\\\\left |  \\\\right |',8)\" \/><area shape=\"rect\" alt=\"\\left \\{ \\cdots \\right.\" title=\"\\left \\{ \\right.\" coords=\"0,112,25,137\" onclick=\"EqEditor.insert('\\\\left \\\\{  \\\\right.',9)\" \/><area shape=\"rect\" alt=\"\\left \\|\\: \\right \\|\" title=\"\\left \\| \\right \\|\" coords=\"28,0,53,25\" onclick=\"EqEditor.insert('\\\\left \\\\|  \\\\right \\\\|',9)\" \/><area shape=\"rect\" alt=\"\\left \\langle \\: \\right \\rangle\" title=\"\\left \\langle \\right \\rangle\" coords=\"28,28,53,53\" onclick=\"EqEditor.insert('\\\\left \\\\langle  \\\\right \\\\rangle',14)\" \/><area shape=\"rect\" alt=\"\\left \\lfloor \\: \\right \\rfloor\" title=\"\\left \\lfloor \\right \\rfloor\" coords=\"28,56,53,81\" onclick=\"EqEditor.insert('\\\\left \\\\lfloor  \\\\right \\\\rfloor',14)\" \/><area shape=\"rect\" alt=\"\\left \\lceil \\: \\right \\rceil\" title=\"\\left \\lceil \\right \\rceil\" coords=\"28,84,53,109\" onclick=\"EqEditor.insert('\\\\left \\\\lceil  \\\\right \\\\rceil',13)\" \/><area shape=\"rect\" alt=\"\\left. \\cdots \\right \\}\" title=\"\\left. \\right \\}\" coords=\"28,112,53,137\" onclick=\"EqEditor.insert('\\\\left.  \\\\right \\\\}',7)\" \/><\/map><\/div><div class=\"panel\" id=\"panel8\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/greeklower.gif\" width=\"68\" height=\"136\" border=\"0\" title=\"Greeklower\" alt=\"Greeklower Panel\" usemap=\"#greeklower_map\" \/><map name=\"greeklower_map\" id=\"greeklower_map\"><area shape=\"rect\" alt=\"\\alpha\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\epsilon\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\theta\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\lambda\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\pi\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\sigma\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\phi\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\omega\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\beta\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\varepsilon\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\vartheta\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\mu\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\varpi\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\varsigma\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\varphi\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\gamma\" coords=\"34,0,48,14\"\/><area shape=\"rect\" alt=\"\\zeta\" coords=\"34,17,48,31\"\/><area shape=\"rect\" alt=\"\\iota\" coords=\"34,34,48,48\"\/><area shape=\"rect\" alt=\"\\nu\" coords=\"34,51,48,65\"\/><area shape=\"rect\" alt=\"\\rho\" coords=\"34,68,48,82\"\/><area shape=\"rect\" alt=\"\\tau\" coords=\"34,85,48,99\"\/><area shape=\"rect\" alt=\"\\chi\" coords=\"34,102,48,116\"\/><area shape=\"rect\" alt=\"\\delta\" coords=\"51,0,65,14\"\/><area shape=\"rect\" alt=\"\\eta\" coords=\"51,17,65,31\"\/><area shape=\"rect\" alt=\"\\kappa\" coords=\"51,34,65,48\"\/><area shape=\"rect\" alt=\"\\xi\" coords=\"51,51,65,65\"\/><area shape=\"rect\" alt=\"\\varrho\" coords=\"51,68,65,82\"\/><area shape=\"rect\" alt=\"\\upsilon\" coords=\"51,85,65,99\"\/><area shape=\"rect\" alt=\"\\psi\" coords=\"51,102,65,116\"\/><\/map><\/div><div class=\"panel\" id=\"panel9\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/greekupper.gif\" width=\"34\" height=\"102\" border=\"0\" title=\"Greekupper\" alt=\"Greekupper Panel\" usemap=\"#greekupper_map\" \/><map name=\"greekupper_map\" id=\"greekupper_map\"><area shape=\"rect\" alt=\"\\Gamma\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\Theta\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\Xi\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\Sigma\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\Phi\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\Omega\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\Delta\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\Lambda\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\Pi\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\Upsilon\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\Psi\" coords=\"17,68,31,82\"\/><\/map><\/div><div class=\"panel\" id=\"panel12\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/relations.gif\" width=\"51\" height=\"221\" border=\"0\" title=\"Relations\" alt=\"Relations Panel\" usemap=\"#relations_map\" \/><map name=\"relations_map\" id=\"relations_map\"><area shape=\"rect\" alt=\"&lt;\" coords=\"0,0,14,14\"\/><area shape=\"rect\" alt=\"\\leq\" coords=\"0,17,14,31\"\/><area shape=\"rect\" alt=\"\\leqslant\" coords=\"0,34,14,48\"\/><area shape=\"rect\" alt=\"\\nless\" coords=\"0,51,14,65\"\/><area shape=\"rect\" alt=\"\\nleqslant\" coords=\"0,68,14,82\"\/><area shape=\"rect\" alt=\"\\prec\" coords=\"0,85,14,99\"\/><area shape=\"rect\" alt=\"\\preceq\" coords=\"0,102,14,116\"\/><area shape=\"rect\" alt=\"\\ll\" coords=\"0,119,14,133\"\/><area shape=\"rect\" alt=\"\\vdash\" coords=\"0,136,14,150\"\/><area shape=\"rect\" alt=\"\\smile\" title=\"smile\" coords=\"0,153,14,167\"\/><area shape=\"rect\" alt=\"\\models\" coords=\"0,170,14,184\"\/><area shape=\"rect\" alt=\"\\mid\" coords=\"0,187,14,201\"\/><area shape=\"rect\" alt=\"\\bowtie\" coords=\"0,204,14,218\"\/><area shape=\"rect\" alt=\"&gt;\" coords=\"17,0,31,14\"\/><area shape=\"rect\" alt=\"\\geq\" coords=\"17,17,31,31\"\/><area shape=\"rect\" alt=\"\\geqslant\" coords=\"17,34,31,48\"\/><area shape=\"rect\" alt=\"\\ngtr\" coords=\"17,51,31,65\"\/><area shape=\"rect\" alt=\"\\ngeqslant\" coords=\"17,68,31,82\"\/><area shape=\"rect\" alt=\"\\succ\" coords=\"17,85,31,99\"\/><area shape=\"rect\" alt=\"\\succeq\" coords=\"17,102,31,116\"\/><area shape=\"rect\" alt=\"\\gg\" coords=\"17,119,31,133\"\/><area shape=\"rect\" alt=\"\\dashv\" coords=\"17,136,31,150\"\/><area shape=\"rect\" alt=\"\\frown\" title=\"frown\" coords=\"17,153,31,167\"\/><area shape=\"rect\" alt=\"\\perp\" coords=\"17,170,31,184\"\/><area shape=\"rect\" alt=\"\\parallel\" title=\"parallel\" coords=\"17,187,31,201\"\/><area shape=\"rect\" alt=\"\\Join\" coords=\"17,204,31,218\"\/><area shape=\"rect\" alt=\"=\" coords=\"34,0,48,14\"\/><area shape=\"rect\" alt=\"\\doteq\" coords=\"34,17,48,31\"\/><area shape=\"rect\" alt=\"\\equiv\" title=\"equivalent\" coords=\"34,34,48,48\"\/><area shape=\"rect\" alt=\"\\neq\" coords=\"34,51,48,65\"\/><area shape=\"rect\" alt=\"\\not\\equiv\" title=\"not equivalent\" coords=\"34,68,48,82\"\/><area shape=\"rect\" alt=\"\\overset{\\underset{\\mathrm{def}}{}}{=}\" title=\"define\" coords=\"34,85,48,99\"\/><area shape=\"rect\" alt=\"\\sim\" coords=\"34,102,48,116\"\/><area shape=\"rect\" alt=\"\\approx\" coords=\"34,119,48,133\"\/><area shape=\"rect\" alt=\"\\simeq\" coords=\"34,136,48,150\"\/><area shape=\"rect\" alt=\"\\cong\" coords=\"34,153,48,167\"\/><area shape=\"rect\" alt=\"\\asymp\" coords=\"34,170,48,184\"\/><area shape=\"rect\" alt=\"\\propto\" title=\"proportional to\" coords=\"34,187,48,201\"\/><\/map><\/div><div class=\"panel\" id=\"panel10\" style=\"height:34px\"><img src=\"https:\/\/latex.codecogs.com\/eqneditor\/panels\/matrix.gif\" width=\"102\" height=\"170\" border=\"0\" title=\"Matrix\" alt=\"Matrix Panel\" usemap=\"#matrix_map\" \/><map name=\"matrix_map\" id=\"matrix_map\"><area shape=\"rect\" alt=\"\\begin{matrix}\n\\cdots \\\\\n\\cdots \\\\\n\\end{matrix}\" title=\"\\begin{matrix} ... \\end{matrix}\" coords=\"0,0,31,31\" onclick=\"EqEditor.makeArrayMatrix('','','')\" \/><area shape=\"rect\" alt=\"\\begin{pmatrix}\n\\cdots \\\\\n\\cdots\n\\end{pmatrix}\" title=\"\\begin{pmatrix} ... \\end{pmatrix}\" coords=\"0,34,31,65\" onclick=\"EqEditor.makeArrayMatrix('p','','')\" \/><area shape=\"rect\" alt=\"\\begin{vmatrix}\n\\cdots \\\\\n\\cdots\n\\end{vmatrix}\" title=\"\\begin{vmatrix} ... \\end{vmatrix}\" coords=\"0,68,31,99\" onclick=\"EqEditor.makeArrayMatrix('v','','')\" \/><area shape=\"rect\" alt=\"\\begin{Vmatrix}\n\\cdots \\\\ \n\\cdots\n\\end{Vmatrix}\" title=\"\\begin{Vmatrix} ... \\end{Vmatrix}\" coords=\"0,102,31,133\" onclick=\"EqEditor.makeArrayMatrix('V','','')\" \/><area shape=\"rect\" alt=\"\\left.\\begin{matrix}\n\\cdots \\\\ \n\\cdots\n\\end{matrix}\\right|\" title=\"\\left.\\begin{matrix}... \\end{matrix}\\right|\" coords=\"0,136,31,167\" onclick=\"EqEditor.makeArrayMatrix('','\\\\left.','\\\\right|')\" \/><area shape=\"rect\" alt=\"\\begin{bmatrix}\n\\cdots \\\\ \n\\cdots\n\\end{bmatrix}\" title=\"\\being{bmatrix} ... \\end{bmatrix}\" coords=\"34,0,65,31\" onclick=\"EqEditor.makeArrayMatrix('b','','')\" \/><area shape=\"rect\" alt=\"\\bigl(\\begin{smallmatrix}\n\\cdots \\\\ \n\\cdots \n\\end{smallmatrix}\\bigr)\" title=\"\\bigl(\\begin{smallmatrix} ... \\end{smallmatrix}\\bigr)\" coords=\"34,34,65,65\" onclick=\"EqEditor.makeArrayMatrix('small','\\\\bigl(','\\\\bigr)')\" \/><area shape=\"rect\" alt=\"\\begin{Bmatrix}\n\\cdots \\\\ \n\\cdots\n\\end{Bmatrix}\" title=\"\\begin{Bmatrix} ... \\end{Bmatrix}\" coords=\"34,68,65,99\" onclick=\"EqEditor.makeArrayMatrix('B','','')\" \/><area shape=\"rect\" alt=\"\\left\\{\\begin{matrix}\n\\cdots \\\\ \n\\cdots\n\\end{matrix}\\right.\" title=\"\\begin{Bmatrix} ... \\end{matrix}\" coords=\"34,102,65,133\" onclick=\"EqEditor.makeArrayMatrix('','\\\\left\\\\{','\\\\right.')\" \/><area shape=\"rect\" alt=\"\\left.\\begin{matrix}\n\\cdots \\\\ \n\\cdots\n\\end{matrix}\\right\\}\" title=\"\\begin{matrix} ... \\end{Bmatrix}\" coords=\"34,136,65,167\" onclick=\"EqEditor.makeArrayMatrix('','\\\\left.','\\\\right\\\\}')\" \/><area shape=\"rect\" alt=\" \\binom{n}{r}\" coords=\"68,0,99,31\" onclick=\"EqEditor.insert('\\\\binom{}{}')\" \/><area shape=\"rect\" alt=\"\\begin{cases}..,x= \\\\..,x=\\end{cases}\" title=\"\\begin{cases} ... \\end{cases}\" coords=\"68,34,99,65\" onclick=\"EqEditor.makeEquationsMatrix('cases', true, true)\" \/><area shape=\"rect\" alt=\"\\begin{align*}\ny&amp;=\\cdots \\\\ \n &amp;+\\cdots \n\\end{align*}\" title=\"\\begin{align} ... \\end{align}\" coords=\"68,68,99,99\" onclick=\"EqEditor.makeEquationsMatrix('align', false)\" \/><\/map><\/div><\/div><\/div><\/div>\n\n<div id=\"bar2\" class=\"top\" style=\"display:none\">\n<div style=\"position:absolute; right:25px; z-index:1000\" ><img style=\"float:right\" src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/icons\/cancel.gif\" onclick=\"Example.hide();\" alt=\"close\" title=\"close panel\" \/>\n<\/div>\n<div id=\"photos\" style=\"position:relative; overflow:hidden; height:68px; width:600px; margin:0 auto\"><\/div>\n<div style=\"height:14px; width:300px; margin:0 auto\">\n<div style=\"float:left; margin-right:5px\"><img id=\"leftarrow\" src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/scroll\/leftarrow_grey.gif\" height=\"14\" width=\"14\" alt=\"<<\" title=\"previous page\" onclick=\"gallery.right()\" \/><\/div>\n<div id=\"overview\" style=\"float:left; width:260px;\"><\/div>\t\t\t\t\n<div style=\"float:left; margin-left:5px\"><img id=\"rightarrow\" src=\"https:\/\/latex.codecogs.com\/eqneditor\/images\/scroll\/rightarrow_grey.gif\" height=\"14\" width=\"14\" alt=\">>\" title=\"next page\" onclick=\"gallery.left()\" \/><\/div>\n<\/div>\n<div id=\"toolbar_example\" style=\"clear:left\">\n<input type=\"button\" class=\"lightbluebutton\" value=\"Алгебра\" onclick=\"Example.show(this,'algebra');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Матан\" onclick=\"Example.show(this,'calculus');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Статистика\" onclick=\"Example.show(this,'stats');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Матрицы\" onclick=\"Example.show(this,'matrices');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Множества\" onclick=\"Example.show(this,'sets');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Тригоном.\" onclick=\"Example.show(this,'trig');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Геометрия\" onclick=\"Example.show(this,'geometry');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Химия\" onclick=\"Example.show(this,'chemistry');\"\/>\n<input type=\"button\" class=\"lightbluebutton\" value=\"Физика\" onclick=\"Example.show(this,'physics');\"\/>\n<\/div>\n<\/div>\n\n<div class=\"toolbar_wrapper\"><div class=\"toolbar\" style=\"z-index:11\"><div class=\"panel\"><select id=\"format\" name=\"format\" title=\"Выберите выходной формат\"><option value=\"gif\">gif<\/option><option value=\"png\">png<\/option><option value=\"pdf\">pdf<\/option><option value=\"swf\">swf<\/option><option value=\"svg\">svg<\/option><\/select><\/div> <div class=\"panel\"><select id=\"font\" name=\"font\" title=\"Шрифт\"><option value=\"\">Latin Modern<\/option><option value=\"jvn\">Verdana<\/option><option value=\"cm\">Computer Modern<\/option><option value=\"phv\">Helvetica<\/option><\/select><\/div> <div class=\"panel\"><select name=\"fontsize\" id=\"fontsize\" title=\"Размер шрифта в уравнении\">\n\t\t\t<option value=\"\\tiny\">(5pt) Крошечный<\/option>\n\t\t\t<option value=\"\\small\">(9pt) Маленький<\/option>\n\t\t\t<option value=\"\" selected=\"selected\">(10pt) Нормальный<\/option>\n\t\t\t<option value=\"\\large\">(12pt) Большой<\/option>\n\t\t\t<option value=\"\\LARGE\">(18pt) <\/option>\n\t\t\t<option value=\"\\huge\">(20pt) Огромный<\/option><\/select><\/div> <div class=\"panel\"><select id=\"dpi\" name=\"dpi\" title=\"Выберите выходное разрешение (dpi)\"><option value=\"50\">50<\/option><option value=\"80\">80<\/option><option value=\"100\">100<\/option><option value=\"110\" selected=\"selected\">110<\/option><option value=\"120\">120<\/option><option value=\"150\">150<\/option><option value=\"200\">200<\/option><option value=\"300\">300<\/option><\/select><\/div> <div class=\"panel\"><select id=\"bg\" name=\"bg\" title=\"Цвет фона\"><option value=\"Transparent\">Прозрачный<\/option><option value=\"White\">Белый<\/option><option value=\"Black\">Чёрный<\/option><option value=\"Red\">Красный<\/option><option value=\"Green\">Зелёный<\/option><option value=\"Blue\">Blue<\/option><\/select><\/div><div class=\"panel\"><input type=\"checkbox\" id=\"inline\" name=\"inline\" title=\"Для вставки небольшого математического выражения в строку с текстом\" \/> <label for=\"inline\">Внутритекстовая<\/label><input type=\"checkbox\" id=\"compressed\" name=\"compressed\" title=\"Для ограничения формулы по высоте. Подходит для вставки посреди текстовой строки\" \/> <label for=\"compressed\">Невысокая<\/label><\/div> <\/div><\/div><\/div>";
            EqEditor.init('Common', undefined, undefined, 'toolbar');
        }
    },
    moveto: function(id) {
        if (id != this.editor_id) {
            var newNode = CCgetId(id);
            while (CCgetId(this.editor_id).childNodes[0]) {
                var oldNode = CCgetId(this.editor_id).childNodes[0];
                oldNode.parentNode.removeChild(oldNode);
                newNode.appendChild(oldNode);
            }
            this.editor_id = id;
        }
    },
    targetFn: null,
    copyToTarget: function(text) {
        if (this.targetFn !== null) this.targetFn(text)
    },
    reset: function() {
        this.setSelIndx('format', 'gif');
        this.setSelIndx('font', '');
        this.setSelIndx('fontsize', '');
        this.setSelIndx('dpi', '110');
        this.setSelIndx('bg', 'Transparent');
    },
    init: function(SID, obj, resize, editorid) {
        Panel.init('hover', editorid);
        if (SID == '') {
            this.SID = Cookie.get('eqeditor');
            if (!this.SID) {
                var d = new Date();
                this.SID = d.getTime();
                Cookie.set('eqeditor', SID, 30);
            }
        } else this.SID = SID;
        if (obj !== undefined) {
            this.add(obj, resize);
            this.targetArea = obj;
        }
        this.setSelIndx('format', Cookie.get('format'));
        this.setSelIndx('font', Cookie.get('font'));
        this.setSelIndx('fontsize', Cookie.get('fontsize'));
        this.setSelIndx('dpi', Cookie.get('dpi'));
        this.setSelIndx('bg', Cookie.get('bg'));
        CConclick('undobutton', function(e) {
            EqEditor.targetArea.undo();
        });
        CConclick('redobutton', function(e) {
            EqEditor.targetArea.redo();
        });
        CConchange('bg', function(e) {
            var b = CCgetId('bg');
            if (b) {
                Cookie.set('bg', b.value, 10);
            }
            EqEditor.update();
        });
        CConchange('dpi', function(e) {
            var d = CCgetId('dpi');
            if (d) {
                Cookie.set('dpi', d.value, 10);
            }
            EqEditor.update();
        });
        CConchange('font', function(e) {
            var f = CCgetId('font');
            if (f) {
                Cookie.set('font', f.value, 10);
            }
            EqEditor.update();
        });
        CConchange('format', function(e) {
            var action = false;
            EqEditor.setFormat(EqEditor.getFormat());
        });
        CConchange('fontsize', function() {
            var f = CCgetId('fontsize');
            if (f) {
                Cookie.set('fontsize', f.value, 10);
            }
            EqEditor.update();
        });
        CConclick('inline', function(e) {
            var a = CCgetId('compressed');
            if (a) a.checked = this.checked;
            EqEditor.update();
        });
        CConclick('compressed', function(e) {
            EqEditor.update();
        });
    },
    textchanged: function() {
        if (this.targetArea.textchanged()) ExportButton.state(true);
    },
    update: function() {
        this.targetArea.textchanged();
        this.targetArea.renderEqn(null);
    },
    load: function(txt) {
        if (this.targetArea != null) this.targetArea.load(txt);
    },
    insert: function(txt, pos, inspos) {
        if (this.targetArea != null) {
            this.targetArea.insertText(txt, pos, inspos);
            ExportButton.state(true);
        }
    },
    getTextArea: function() {
        if (this.targetArea != null) return this.targetArea;
        return null;
    },
    clearText: function() {
        this.targetArea.clearText();
        ExportButton.state(false);
    },
    setFormat: function(type) {
        EqEditor.format = type;
        switch (type) {
            case 'gif':
                action = false;
                break;
            case 'png':
                action = false;
                break;
            case 'pdf':
                action = true;
                break;
            case 'swf':
                action = true;
                break;
            case 'emf':
                action = true;
                break;
        }
        Cookie.set('format', type, 10);
        var a = CCgetId('dpi');
        if (a) {
            a.disabled = action;
            a.readonly = action;
        }
        a = CCgetId('bg');
        if (a) {
            a.disabled = action;
            a.readonly = action;
        }
        EqEditor.targetArea.changed = true;
        EqEditor.targetArea.renderEqn(null);
    },
    getFormat: function() {
        var a = CCgetId('format');
        if (a) return a.value;
        return EqEditor.format;
    },
    getFont: function() {
        var a = CCgetId('font');
        if (a && a.value != '') return '\\fn_' + a.value + ' ';
        return '';
    },
    getSize: function() {
        var a = CCgetId('fontsize');
        if (a && a.value != '') return a.value + ' ';
        return '';
    },
    getDPI: function() {
        var a = CCgetId('dpi');
        if (a && a.value != '110') return '\\dpi{' + a.value + '} ';
        return '';
    },
    getBG: function() {
        var a = CCgetId('bg');
        if (a) {
            var b = a.value.toLowerCase();
            if (b != 'transparent') return '\\bg_' + b + ' ';
        }
        return '';
    },
    getCompressed: function() {
        var a = CCgetId('compressed');
        if (a && a.checked) return '\\inline ';
        return '';
    },
    get_inline_wrap: function(text, norm, inline) {
        var a = CCgetId('inline');
        if (a) {
            var b = CCgetId('compressed');
            if (a.checked) {
                if (!b.checked) text = '\\displaystyle ' + text;
                return inline.replace("{$TEXT}", text);
            } else {
                if (b.checked) text = '\\inline ' + text;
                return norm.replace("{$TEXT}", text);
            }
        }
        return norm.replace("{$TEXT}", text);
    },
    extendchar: null,
    countclick: function() {
        this.targetArea.countclick();
        var a = CCgetId('redobutton');
        if (a) a.src = EDITOR_SRC + "/images/buttons/redo-x.gif";
        a = CCgetId('undobutton');
        if (a) a.src = EDITOR_SRC + "/images/buttons/undo.gif";
    },
    tabHandler: function(e) {
        var TABKEY = 9;
        var inp = this.targetArea.equation_input;
        if (e.keyCode == TABKEY) {
            if (document.selection) {
                var sel = document.selection.createRange();
                i = inp.value.length + 1;
                var theCaret = sel.duplicate();
                while (theCaret.parentElement() == inp && theCaret.move("character", 1) == 1) --i;
                startPos = i;
                if (startPos == inp.value.length) return true;
            } else {
                startPos = inp.selectionStart;
                if (startPos == inp.value.length) return true;
            }
            var a = inp.value.indexOf('{', startPos);
            if (a == -1) a = inp.value.length;
            else a++;
            var b = inp.value.indexOf('&', startPos);
            if (b == -1) b = inp.value.length;
            else b++;
            var c = inp.value.indexOf('\\\\', startPos);
            if (c == -1) c = inp.value.length;
            else c += 2;
            var pos = Math.min(Math.min(a, b), c);
            if (document.selection) {
                range = inp.createTextRange();
                range.collapse(true);
                pos -= inp.value.substr(0, pos).split("\n").length - 1;
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            } else inp.setSelectionRange(pos, pos);
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
    },
    backCursor: function(myField) {
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            if (sel.text.length > 0) sel.text = '';
            else {
                sel.moveEnd('character', 1);
                sel.text = '';
            }
            sel.select();
        } else if (myField.selectionStart || myField.selectionStart == '0') {
            s = myField.selectionStart;
            e = myField.selectionEnd;
            myField.value = myField.value.substring(0, s) + myField.value.substring(e + 1, myField.value.length);
            myField.selectionStart = s;
            myField.selectionEnd = s;
            myField.focus();
        }
    },
    extendkey: function(letter) {
        switch (this.key_text) {
            case '\\left':
                this.insert(' \\right ' + letter, 0);
                break;
            case '\\frac':
            case '\\tfrac':
                if (letter == '}') this.insert('}{}', 0);
                break;
            case '\\begin':
                if (letter == '}') this.insert('} \\end{}', 0);
                break;
            default:
                this.insert(letter, 0);
        }
        this.extendchar = letter;
    },
    keyHandler: function(e) {
        var keycode;
        if (window.event) keycode = window.event.keyCode;
        else if (e) keycode = e.which;
        var keystr = String.fromCharCode(keycode);
        if (keystr == this.extendchar) this.backCursor(this.equation_input);
        this.extendchar = null;
        switch (keystr) {
            case '{':
                this.extendkey('}');
                break;
            case '[':
                this.extendkey(']');
                break;
            case '(':
                this.extendkey(')');
                break;
            case '"':
                this.extendkey('"');
                break;
        }
        if (keystr != ' ') {
            if (keystr == '\\') this.key_text = '\\';
            else if (!keystr.match(/^[a-zA-Z]$/)) this.key_text = '';
            else this.key_text += keystr;
        }
    },
    addText: function(wind, textbox, txt) {
        var myField = wind.getElementById(textbox);
        if (wind.selection) {
            myField.focus();
            sel = wind.selection.createRange();
            sel.text = txt;
        } else {
            var scrolly = myField.scrollTop;
            if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                var cursorPos = startPos + txt.length;
                myField.value = myField.value.substring(0, startPos) + txt + myField.value.substring(endPos, myField.value.length);
                pos = txt.length + endPos - startPos;
                myField.selectionStart = cursorPos;
                myField.selectionEnd = cursorPos;
                myField.focus();
                myField.setSelectionRange(startPos + pos, startPos + pos);
            } else myField.value += txt;
            myField.scrollTop = scrolly;
        }
    },
    makeEquationsMatrix: function(type, isNumbered, isConditional) {
        if (isNumbered === undefined) isNumbered = false;
        if (isConditional === undefined) isNumbered = false;
        eqns = "\\begin{" + type + ((isNumbered) ? "" : "*") + "}";
        eqi = "\n &" + ((isNumbered) ? " " : "= ") + ((isConditional) ? "\\text{ if } x= " : "");
        eqEnd = "\n\\end{" + type + ((isNumbered) ? "" : "*") + "}";
        i = 0;
        dim = prompt('Enter the number of lines:', '');
        if (dim != '' && dim !== null) {
            n = parseInt(dim);
            if (!isNaN(n)) {
                for (i = 1; i <= n - 1; i++) eqns = eqns + (eqi + "\\\\ ");
                eqns = (eqns + eqi) + eqEnd;
                this.insert(eqns, type.length + ((isNumbered) ? 0 : 1) + 9);
            }
        }
    },
    makeArrayMatrix: function(type, start, end) {
        var matr = start + '\\begin{' + type + 'matrix}';
        var row = "\n";
        var mend = "\n\\end{" + type + "matrix}" + end;
        var i = 0;
        var dim = prompt('Enter the array dimensions separated by a comma (e.g. "2,3" for 2 rows and 3 columns):', '');
        if (dim !== '' && dim !== null) {
            dim = dim.split(',');
            m = parseInt(dim[0]);
            n = parseInt(dim[1]);
            if (!isNaN(m) && !isNaN(n)) {
                for (i = 2; i <= n; i++) row = row + ' & ';
                for (i = 1; i <= m - 1; i++) matr = matr + row + '\\\\ ';
                matr = matr + row + mend;
                this.insert(matr, type.length + start.length + 15);
            }
        }
    },
    resize: function(num) {
        var x, y;
        if (self.innerHeight) y = self.innerHeight;
        else if (document.documentElement && document.documentElement.clientHeight) y = document.documentElement.clientHeight;
        else if (document.body) y = document.body.clientHeight;
        this.targetArray[num].equation_input.style.height = parseInt(Math.max((y - 200) / 3, 40)) + 'px';
    }
};
var oDiv = document.createElement('div');
var oImg = document.createElement('img');
var Scroll = function() {};
Scroll.prototype = {
    init: function(maindiv, leftarrow, rightarrow, overview, newpanel_php) {
        this.panels = 0;
        this.maxpanels = 0;
        this.speed = 10;
        this.pause = 2;
        this.visible = 0;
        this.visible_num = 2;
        this.layers = new Array();
        this.layers_offset = new Array();
        this.new_offset = 0;
        this.subtext = '';
        this.vertical = false;
        this.left_arrow = document.getElementById(leftarrow);
        this.right_arrow = document.getElementById(rightarrow);
        this.maindiv = document.getElementById(maindiv);
        if (overview !== '') this.overview = document.getElementById(overview);
        else this.overview = null;
        if (newpanel_php.indexOf('_json') > -1) {
            this.ajax_php = null;
            this.json_php = newpanel_php;
            this.ajax_response_fn = null;
        } else {
            this.ajax_php = newpanel_php;
            this.json_php = null;
            var obj = this;
            this.ajax_response_fn = function() {
                obj.add_panel_response();
            };
        }
    },
    set_subtext: function(text) {
        this.subtext = text;
    },
    set_width: function(width, height, speed) {
        this.width = width;
        this.height = height;
        this.speed = speed;
        if (this.vertical) this.step = this.step_total = this.height / this.speed;
        else this.step = this.step_total = this.width / this.speed;
    },
    add: function(layer) {
        var offset = this.new_offset;
        if (this.vertical) this.new_offset += this.height;
        else this.new_offset += this.width;
        this.layers[this.panels] = layer;
        this.layers_offset[this.panels] = offset;
        this.panels++;
        if (this.panels > this.maxpanels) this.maxpanels = this.panels;
        layer.style.position = 'absolute';
        if (this.vertical) layer.style.top = offset + 'px';
        else layer.style.left = offset + 'px';
    },
    add_id: function(layer_id) {
        var lyr = document.getElementById(layer_id);
        if (lyr) this.add(lyr);
    },
    add_panel_div: function(newdiv) {
        this.add(newdiv);
        this.maindiv.appendChild(newdiv);
        if (this.visible + this.visible_num >= this.panels) this.add_panel();
    },
    add_panel_response: function() {
        if (req.readyState == 4) {
            if (req.status == 200 && req.responseText.length > 0) {
                var newdiv = oDiv.cloneNode(false);
                newdiv.innerHTML = req.responseText;
                this.add_panel_div(newdiv);
            }
            this.setarrow();
            this.setoverview();
        }
    },
    add_panel_json: function(info) {
        if (info.length > 0) {
            var newdiv = oDiv.cloneNode(false);
            newdiv.innerHTML = info;
            this.add_panel_div(newdiv);
        }
        this.setarrow();
        this.setoverview();
    },
    add_panel: function() {
        if (this.ajax_php && this.ajax_response_fn) {
            if (this.ajax_php.indexOf("?") == -1) loadXMLDoc(this.ajax_php + '?panel=' + this.panels + this.subtext, this.ajax_response_fn);
            else loadXMLDoc(this.ajax_php + '&panel=' + this.panels + this.subtext, this.ajax_response_fn);
        } else if (this.json_php) {
            var a = this.panels;
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            if (this.json_php.indexOf("?") == -1) script.src = this.json_php + '?panel=' + a + this.subtext;
            else script.src = this.json_php + '&panel=' + a + this.subtext;
            head.appendChild(script);
        }
    },
    redraw: function() {
        if (this.json_php || (this.ajax_php && this.ajax_response_fn)) {
            this.panels = 0;
            this.visible = 0;
            this.new_offset = 0;
            while (this.maindiv.firstChild) {
                this.maindiv.removeChild(this.maindiv.firstChild);
            }
        }
        if (this.ajax_php && this.ajax_response_fn) {
            var obj = this;
            if (this.ajax_php.indexOf("?") == -1) loadXMLDoc(obj.ajax_php + '?panel=' + this.panels + this.subtext, obj.ajax_response_fn);
            else loadXMLDoc(obj.ajax_php + '&panel=' + this.panels + this.subtext, obj.ajax_response_fn);
        } else if (this.json_php) {
            var a = this.panels;
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            if (this.json_php.indexOf("?") == -1) script.src = this.json_php + '?panel=' + a + this.subtext;
            else script.src = this.json_php + '&panel=' + a + this.subtext;
            head.appendChild(script);
        }
    },
    move: function(dx) {
        this.new_offset += dx;
        for (var p = 0; p < this.panels; p++) {
            this.layers_offset[p] += dx;
            if (this.vertical) this.layers[p].style.top = this.layers_offset[p] + 'px';
            else this.layers[p].style.left = this.layers_offset[p] + 'px';
        }
        this.step++;
        if (this.step < this.step_total) {
            var obj = this;
            window.setTimeout(function() {
                obj.move(dx);
            }, this.pause);
        }
    },
    setoverview: function() {
        if (this.overview !== null) {
            this.overview.innerHTML = '';
            var txt = '';
            var obj = this;
            for (i = 0; i < this.maxpanels; i++) {
                newimg = oImg.cloneNode(false);
                newimg.className = 'overview';
                if (i >= this.visible && i < (this.visible + this.visible_num)) newimg.src = "https://www.codecogs.com/images/scroll/soliddot.gif";
                else {
                    newimg.src = "https://www.codecogs.com/images/scroll/emptydot.gif";
                    newimg.i = i;
                    newimg.onclick = function() {
                        obj.jump(this);
                    };
                }
                this.overview.appendChild(newimg);
            }
        }
    },
    setarrow: function() {
        this.left_arrow.src = 'https://www.codecogs.com/images/scroll/' + (this.visible <= 0 ? 'leftarrow_grey.gif' : 'leftarrow.gif');
        this.right_arrow.src = 'https://www.codecogs.com/images/scroll/' + (this.visible >= (this.panels - 1) ? 'rightarrow_grey.gif' : 'rightarrow.gif');
    },
    jump: function(obj) {
        if (this.step == this.step_total) {
            panel = obj.i;
            var gap = panel - this.visible;
            this.step = this.step_total - Math.abs(gap) * this.step_total;
            if (this.visible > panel) this.move(this.speed);
            else this.move(-this.speed);
            this.visible += gap;
            if (this.visible + this.visible_num >= this.panels) this.add_panel();
            else {
                this.setarrow();
                this.setoverview();
            }
        }
    },
    left: function() {
        if (this.step == this.step_total) {
            if (this.visible < (this.panels - 1)) {
                this.visible++;
                this.step = 0;
                this.move(-this.speed);
                if (this.visible + this.visible_num >= this.panels) this.add_panel();
                else {
                    this.setarrow();
                    this.setoverview();
                }
            }
        }
    },
    right: function() {
        if (this.step == this.step_total) {
            if (this.visible > 0) {
                this.step = 0;
                this.move(this.speed);
                this.visible--;
                this.setarrow();
                this.setoverview();
            }
        }
    },
    subsearch: function(text) {
        if (text !== '') this.subtext = ('&subtext=' + text);
        else this.subtext = '';
        this.redraw();
    }
};
