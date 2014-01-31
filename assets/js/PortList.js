/**
 * Chrome-Extension-Template v1.0
 *
 * @author Dustin Breuer <dustin.breuer@thedust.in>
 * @version 1.0
 * @category chrome-extension
 * @licence MIT http://opensource.org/licenses/MIT
 */

/**
 *
 * @constructor
 */
function PortList() {
    /**
     * An Array that contains all connected Ports
     * @type {chrome.runtime.Port[]}
     * @private
     */
    this._aPorts = [];

}

/**
 * Add Port <i>oPort</i> to this PortList
 *
 * @param {chrome.runtime.Port} oPort
 *
 * @returns {PortList}
 */
PortList.prototype.add = function (oPort) {
    this._aPorts.push(oPort);

    return this;
};

/**
 * Remove Port <i>oPort</i> from this PortList
 *
 * @param {chrome.runtime.Port} oPort
 *
 * @returns {PortList}
 */
PortList.prototype.remove = function (oPort) {
    var _iPortIndex = this.index(oPort);

    if (_iPortIndex !== -1) {
        this._aPorts = this._aPorts.splice(_iPortIndex, 1);
    }

    return this;
};

/**
 * Check if this PortList contains Port <i>oPort</i>
 *
 * @param {chrome.runtime.Port} oPort
 *
 * @returns {Boolean}
 */
PortList.prototype.has = function (oPort) {
    return (this.index(oPort) !== -1);
};

/**
 * Returns the length of this PortList
 *
 * @returns {Number}
 */
PortList.prototype.size = function () {
    return this._aPorts.length;
};

/**
 * Returns all listed ports
 *
 * @returns {chrome.runtime.Port[]}
 */
PortList.prototype.getArray = function () {
    return this._aPorts;
};

/**
 * Add Port <i>oPort</i> to this PortList
 *
 * @param {chrome.runtime.Port} oPort
 *
 * @returns {Number}
 */
PortList.prototype.index = function (oPort) {
    return this._aPorts.indexOf(oPort);
};

/**
 * Send the message <i>this</i> to the Port <i>oPort</i>
 *
 * @param {chrome.runtime.Port} oPort
 *
 * @this {Message}
 * @private
 */
PortList.__sendBroadcast = function (oPort) {
    oPort.postMessage(this);
};

/**
 * Send the message <i>oMessage</i> to all connected ports
 *
 * @param {Message} oMessage
 *
 * @returns {PortList}
 */
PortList.prototype.sendBroadcast = function (oMessage) {
    this._aPorts.forEach(PortList.__sendBroadcast, oMessage);

    return this;
};