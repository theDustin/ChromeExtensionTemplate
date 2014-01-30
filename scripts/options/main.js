
document.addEventListener("DOMContentLoaded", function(){
    console.log("DOMContentLoaded");

    /**
     *
     * @type {chrome.storage.Sync}
     * @private
     */
    var _oOptionsStorage = chrome.storage.sync;

    document.forms[0].addEventListener("submit", function(e){
        e.preventDefault();

        serializeForm(this);
    });

    /**
     *
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} oNode
     */
    function getValueByNode(oNode) {

        switch (oNode.tagName.toLowerCase()){
            case "input":
                // TODO: checkbox, radio, date
                return oNode.value;
                break;
            case "select":
                if(!oNode.multiple){
                    return oNode.value;
                } else {
                    var _aValues = [];

                    for(var i = 0, j = oNode.options.length; i < j; i++){
                        if(oNode.options[i].selected){
                            _aValues.push(oNode.options[i].value);
                        }
                    }

                    return _aValues;
                }
                break;
            case "textarea":
                return oNode.value;
                break;
        }

    }

    /**
     *
     * @param {HTMLFormElement} oForm
     *
     * @returns {Object.<String, *>}
     */
    function serializeForm(oForm){
        var _oRet = {},
            _aElements = Array.prototype.slice.call(oForm.querySelectorAll("input,select,textarea"));

        _aElements.forEach(function(oNode){
            var _oParent = oNode.parentNode,
                _aKeys = [];

            while(_oParent !== oForm){
                if(_oParent.name){
                    _aKeys.unshift(_oParent.name);
                }

                _oParent = _oParent.parentNode;
            }

            if(oForm.name){
                _aKeys.unshift(oForm.name);
            }

            var _oTarget = _oRet;
            for(var i = 0; i < _aKeys.length; i++){
                if(!_oTarget[_aKeys[i]]){
                    _oTarget[_aKeys[i]] = {};
                }

                _oTarget = _oTarget[_aKeys[i]];
            }

            _oTarget[oNode.name] = getValueByNode(oNode);
        });

        console.dir(_oRet);

        return _oRet;
    }

});