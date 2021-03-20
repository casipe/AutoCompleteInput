// 
/*!
 * AutoCompleteInput
 * version: 1.x.x
 * Author: (c) 2021 Carlivan Silva Pereira, carlivanpereira@gmail.com 
 * http://www.casipe.com.br
 */

(function () {

    var extend = function (a, b) {

        for (var key in b) {
            if (b.hasOwnProperty(key)) {

                a[key] = b[key];
            }
        }
        return a;
    }
    const appendBefore = function (self, element) {
        element.parentNode.insertBefore(self, element);
    };
    const appendAfter = function (self, element) {
        element.parentNode.insertBefore(self, element.nextSibling);
    };
    const init = function (selector, options) {
        let $self = document.querySelectorAll(selector);
        let settings = new extend({
            datas: [],
            source: {
                method: 'POST',
                url: null,
                data: {},
            },
            minCharSearch: 2,
            selectorSearch: null,
            strProcessig: null,
            onProcessing: () => null,
            onComplete: () => null,
            onSelect: () => null,
            error: () => null,
        }, options);

        for (var i = 0; i < $self.length; i++) {
            let $input = $self[i],
                    div = document.createElement("div"),
                    selector = "AutoCompleteInput_" + i;
            $input.setAttribute("data-id", selector);
            div.setAttribute("id", selector);

            appendAfter(div, $input);

            $input.addEventListener("keyup", function (e) {
                let divElem = document.getElementById(this.getAttribute("data-id"));
                divElem.innerHTML = '';
                let elemInput = this,
                        val = elemInput.value;
                if (val.length >= settings.minCharSearch) {

                    let render = function (list) {
                        var html = '<ul class="autoCompleteInput" style="width:' + elemInput.offsetWidth + 'px">';
                        list.map(item => {
                            html += '<li class="list-item" style="width:' + (elemInput.offsetWidth - 2) + 'px"'
                                    + ' data-key="' + item.key + '"'
                                    + ' data-value="' + item.value + '"'
                                    + '><a href="javascript:void(0)">' + item.description + '</a></li>';
                        });
                        html += '</ul>';
                        divElem.innerHTML = html;
                        divElem.querySelectorAll('li').forEach(function (e) {
                            e.removeEventListener("click", null);
                            $input.removeEventListener("blur", null);
                            $input.addEventListener("blur", function (e) {
                                setTimeout(() => {
                                    divElem.innerHTML = '';
                                }, 200);
                            });
                            e.addEventListener("click", function (e) {
                                let key = this.getAttribute("data-key"),
                                        value = this.getAttribute("data-value");
                                if (typeof settings.onSelect == 'function') {
                                    let item = null;
                                    for (var i in list) {
                                        let items = list[i];
                                        for (var k in items) {
                                            if (k == 'key' && items[k] == key) {
                                                item = list[i];
                                                break;
                                            }
                                        }
                                        if (item != null) {
                                            break;
                                        }
                                    }
                                    settings.onSelect(item);
                                }
                                elemInput.value = value;
                                divElem.innerHTML = '';
                            }, false);
                        });
                    }
                    let q = val;
                    if (settings.selectorSearch) {
                        q = document.querySelector(settings.selectorSearch).value;
                    }
                    if (settings.datas.length) {
                        let a = settings.datas, b;
                        b = a.filter((item) => {
                            return item.value
                                    .toUpperCase()
                                    .search(q.toUpperCase()) != -1;
                        });
                        if (b.length) {
                            render(b);
                        }
                    } else if (typeof settings.source.url == 'string' && settings.source.url.length) {

                        let formData = new FormData(),
                                data = settings.source.data;
                        formData.append('q', q);
                        for (var key in data) {
                            formData.append(key, data[key]);
                        }
                        let xmlHttp = new XMLHttpRequest();
                        xmlHttp.onreadystatechange = function () {
                            if (typeof settings.onProcessing == 'function') {
                                settings.onProcessing();
                            }
                            if (xmlHttp.readyState != 4) {
                                if (settings.strProcessig) {
                                    divElem.innerHTML = settings.strProcessig;
                                }
                            }
                        }
                        xmlHttp.open(settings.source.method, settings.source.url, true);
                        xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        xmlHttp.send(formData);
                        xmlHttp.onload = function (e) {
                            if (this.readyState == 4 && this.status == 200) {
                                try {
                                    let res = JSON.parse(this.responseText);
                                    if (res.length) {
                                        render(res);
                                    }
                                    if (typeof settings.onResponse == 'function') {
                                        settings.onComplete(res);
                                    }
                                } catch (e) {
                                    console.error('AutoCompleteInput', e)
                                    if (typeof settings.error == 'function') {
                                        settings.error(e);
                                    }
                                }
                            } else {
                                alert('Falha na requisição');
                                if (typeof settings.error == 'function') {
                                    settings.error(this);
                                }
                            }
                        }
                    }
                }
            }
            , false);
        }
        return this;
    }
    init.prototype = init;
    extend.prototype = extend;
    const Plugin = function (selector, options) {
        this.selector = selector;
        this.options = options;
        return this;
    };
    Plugin.prototype = {
        init: function () {
            return new init(this.selector, this.options);
        },
        extend: function (a, b) {
            return new extend(a, b);
        },
    };
    // export to global namespace
    window.AutoCompleteInput = (selector, options) => new Plugin(selector, options).init();
})(window);







