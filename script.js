var CORS_PASS = [
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.x7.workers.dev/'
];
var DEBUG = false;

function toArray(obj) {
    var array = [];
    for (var i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
    }
    return array;
}

// override new dict1 keys into old default dict2
function mergeDict(dict1, dict2) {
    Object.keys(dict1).forEach(function(k) {
        dict2[k] = dict1[k]
    });
    return dict2;
}

function downloadFont(family) {
    WebFont.load({google: {families: [family]}});
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('rfc-form');
    var error = document.getElementById('error');
    var content = document.getElementById('content');

    var urlParams = getUrlGetParameters();
    setInputValues(urlParams);
    if (urlParams && urlParams.rfcNumber) {
        applyInputs();
    }

    form.addEventListener('submit', function(e) {
        applyInputs(e)
    });

    function applyInputs(e) {
        if (e && DEBUG) {
            e.preventDefault();
        }
        var inputs = getInputValues();
        if (inputs['fontFamily'] !== 'monospace'){
            downloadFont(inputs['fontFamily']);
        }
        setCss(inputs);

        if (inputs.rfcNumber) {
            fetch(CORS_PASS[0] + 'https://www.ietf.org/rfc/rfc' + inputs.rfcNumber + '.txt').then(function (response) {
                if (response.ok) {
                    return response.text();
                } else {
                    throw response.status + ' ' + response.statusText;
                }
            }).then(function (text) {
                setContent(text, inputs.rfcNumber);
                setError('');
            }).catch(function (e) {
                setError(e);
            });
        }
    }

    function setError(text) {
        error.textContent = text;
    }

    function getUrlGetParameters() {
        var inputs = {};
        if (window.location.search) {
            inputs = window.location.search.substr(1).split('&')
                .reduce(function(acc,x ) {
                    var i = x.split('=');
                    acc[i[0]] = decodeURIComponent(i[1]);
                    return acc;
                }, {});
        }
        return inputs;
    }

    function getInputValues() {
        return toArray(form.elements)
            .filter(function(x) { return x.tagName === 'INPUT' })
            .reduce(function(acc, x) { acc[x.id] = x.value.trim(); return acc }, {});
    }

    function setInputValues(values) {
        Object.keys(values).forEach(function(key) {
            if (values[key]) {
                document.getElementById(key).value = values[key];
            }
        });
    }

    function setContent(text, rfcNumber) {
        content.innerText = text;
        content.setAttribute('data-rfc', rfcNumber);
    }

    function setCss(values) {
        Object.keys(values).forEach(function(key) {
            document.body.style[key] = values[key];
        });
    }
});
