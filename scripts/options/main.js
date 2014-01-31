/**
 * Chrome-Extension-Template v1.0
 *
 * @author Dustin Breuer <dustin.breuer@thedust.in>
 * @version 1.0
 * @category chrome-extension
 * @licence MIT http://opensource.org/licenses/MIT
 */

document.addEventListener("DOMContentLoaded", function () {

    /**
     *
     * @type {EasyStorage}
     * @private
     */
    var _oOptionsStorage = new EasyStorage();

    document.forms[0].addEventListener("submit", function (oEvent) {
        oEvent.preventDefault();

        _oOptionsStorage.set(serializeForm(this), function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.info("%O saved", this);
            }
        });
    });

    _oOptionsStorage.getEntireStorage(setFormValues);

    /**
     * Set the option-values by passing an key-values Object
     *
     * @param {Object.<String, *>} oItems
     */
    function setFormValues(oItems){
        var _mValue, _aElements;

        for(var _sKey in oItems){
            _mValue = oItems[_sKey];
            _aElements = toArray(document.getElementsByName(_sKey));

            if(typeof _mValue !== "object"){
                if(_aElements.length === 1){
                    var _oNode = _aElements[0];

                    if(_oNode instanceof HTMLInputElement && (_oNode.type === "checkbox" || _oNode.type === "radio")){
                        _oNode.checked = true;
                    } else {
                        _oNode.value = _mValue;
                    }
                } else if(_aElements.length > 1) {
                    // radio
                    (_aElements.filter(function(oNode){
                        return (_mValue.indexOf(oNode.value) !== -1);
                    })[0] || {}).checked = true;
                } else {
                    console.dir(_aElements);
                    console.info("No input[name=%s] found", _sKey);
                }
            } else if(_mValue instanceof Array){
                console.log("Set value %O for element with the name %s", _mValue, _sKey);

                if(_aElements.length === 1){
                    // select
                    toArray(_aElements[0].options).filter(function(oNode){
                        return (_mValue.indexOf(oNode.value) !== -1);
                    }).forEach(function (oNode) {
                        oNode.selected = true;
                    });

                } else if(_aElements.length > 1){
                    // checkbox

                    _aElements.filter(function(oNode){
                        return (_mValue.indexOf(oNode.value) !== -1);
                    }).forEach(function (oNode) {
                        oNode.checked = true;
                    });

                } else {
                    console.info("%O for key %s is of unknown type", _sKey, oNode);
                }

            } else {
                setFormValues(_mValue);
            }
        }
    }

    /**
     * Transform a NodeList, Collection or something else "Array-like" to an real Array
     *
     * @param {Object} oArrayLikeObject
     *
     * @returns {Array}
     */
    function toArray(oArrayLikeObject) {
        return Array.prototype.slice.call(oArrayLikeObject);
    }

    /**
     * Return the value of the node <i>oNode</i>.
     * This function return an Array for a select-node, otherwise a simple value
     *
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} oNode
     *
     * @returns {String|String[]|null}
     *
     * @see getSimpleValue
     */
    function getValueByNode(oNode) {
        if (!oNode.multiple) {
            return oNode.value;
        } else {
            return toArray(oNode.options).filter(isSelected).map(getSimpleValue);
        }
    }

    /**
     * Check if the node <i>oNode</i> is checked
     *
     * @param {HTMLInputElement} oNode
     *
     * @returns {boolean}
     */
    function isChecked(oNode) {
        return !!oNode.checked;
    }

    /**
     * Check if the node <i>oNode</i> is selected
     *
     * @param {HTMLOptionElement} oNode
     *
     * @returns {boolean}
     */
    function isSelected(oNode) {
        return !!oNode.selected;
    }

    /**
     * Return the simple value of the node <i>oNode</i>
     *
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} oNode
     *
     * @returns {String}
     */
    function getSimpleValue(oNode) {
        return oNode.value;
    }

    /**
     * Serialize a form and use all name-attributes
     *
     * @param {HTMLFormElement} oForm
     *
     * @returns {Object.<String, *>}
     */
    function serializeForm(oForm) {
        var _oRet = {},
            _aElements = toArray(oForm.querySelectorAll("input,select,textarea"));

        _aElements.forEach(function (oNode) {
            var _oParent = oNode.parentNode,
                _aKeys = [],
                _bIsInput = oNode instanceof HTMLInputElement;

            if (_bIsInput && oNode.type.toLowerCase() === "radio" && !oNode.checked) {
                // Not checked - next!
                return;
            }

            while (_oParent !== oForm) {
                if (_oParent.name) {
                    _aKeys.unshift(_oParent.name);
                }

                _oParent = _oParent.parentNode;
            }

            if (oForm.name) {
                _aKeys.unshift(oForm.name);
            }

            var _oTarget = _oRet;
            for (var i = 0; i < _aKeys.length; i++) {
                if (!_oTarget[_aKeys[i]]) {
                    _oTarget[_aKeys[i]] = {};
                }

                _oTarget = _oTarget[_aKeys[i]];
            }

            if (!_bIsInput || oNode.type.toLowerCase() !== "checkbox") {
                _oTarget[oNode.name] = getValueByNode(oNode);

            } else if (!_oTarget[oNode.name]) {
                var _oClosestNamedParent = oNode.parentNode, _aOtherCheckboxen;

                while (!_oClosestNamedParent.name && _oClosestNamedParent.parentNode) {
                    _oClosestNamedParent = _oClosestNamedParent.parentNode;
                }

                _aOtherCheckboxen = toArray(_oClosestNamedParent.querySelectorAll('input[type="checkbox"][name="' + oNode.name + '"]'));

                if (_aOtherCheckboxen.length === 1) {
                    // The one checkbox to rule them all
                    if (isChecked(oNode)) {
                        _oTarget[oNode.name] = getSimpleValue(oNode);
                    }
                } else {
                    _oTarget[oNode.name] = _aOtherCheckboxen.filter(isChecked).map(getSimpleValue);
                }
            }
        });

        return _oRet;
    }

});