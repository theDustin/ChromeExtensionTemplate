/**
 * Chrome-Extension-Template v1.0
 *
 * @author Dustin Breuer <dustin.breuer@thedust.in>
 * @version 1.0
 * @category chrome-extension
 * @licence MIT http://opensource.org/licenses/MIT
 */

window.addEventListener("load", function () {

    /**
     * An Array that contains all connected Ports
     * @type {PortList}
     * @private
     */
    var _oPortList = new PortList(),
        /**
         * @class
         */
            HelloMessage = Message.createMessageType("hello"),
        /***
         * @class
         */
            ConfigMessage = Message.createMessageType("config",
            /**
             * @lends Message.prototype
             */
            {
                foo : "bar"
            }
        );

    chrome.runtime.onConnect.addListener(_onRuntimePortConnect);

    /**
     * Callback for connecting with tab-injected Script
     *
     * @param {chrome.runtime.Port} oPort The connected Port
     *
     * @private
     */
    function _onRuntimePortConnect(oPort) {
        console.info("%O connected", oPort);

        _oPortList.add(oPort);

        oPort.onDisconnect.addListener(_onRuntimePortDisconnect);
        oPort.onMessage.addListener(_onRuntimePortMessage);

        oPort.postMessage(new HelloMessage());
    }

    /**
     * Callback for disconnecting with tab-injected Script
     *
     * @param {chrome.runtime.Port} oPort The disconnected Port
     *
     * @private
     */
    function _onRuntimePortDisconnect(oPort) {
        console.info("%O disconnected", oPort);

        _oPortList.remove(oPort);
    }

    /**
     * Callback for receiving a message from a tab-injected Script
     *
     * @param {*} oMessage The message sent by the calling script
     * @param {chrome.runtime.Port} oSender
     * @param {Function} oSendResponse Function to call (at most once) when you have a response
     * {@link http://developer.chrome.com/extensions/runtime.html#property-onMessage-sendResponse}
     *
     * @returns {?Boolean} returns true, to keep the message channel open and send a response asynchronously
     *
     * @private
     * @link http://developer.chrome.com/extensions/runtime.html#event-onMessage
     */
    function _onRuntimePortMessage(oMessage, oSender, oSendResponse) {
        console.info("Receive %O by %O", oMessage, oSender);

        switch (oMessage.type) {
            case HelloMessage.Type:

                oSendResponse(new ConfigMessage({
                    foo : "myBar"
                }));
                break;
        }

        // uncomment if you want to keep the message channel open and send a response asynchronously
        // {@link http://developer.chrome.com/extensions/runtime.html#property-onMessage-sendResponse}
        // return true;
    }

    chrome.webNavigation.onDOMContentLoaded.addListener(function (oDetails) {
        console.info("chrome.webNavigation.onDOMContentLoaded(%O) :: ready to inject", oDetails);

        var iTabId = oDetails.tabId;

        chrome.tabs.get(iTabId, function (oTab) {
            //            chrome.tabs.insertCSS(oTab.id, {
            //                file : 'background/inject-style.css',
            //                runAt : 'document_start'
            //            });

            chrome.tabs.executeScript(oTab.id, {
                file : '/scripts/background/inject.js',
                runAt : 'document_start'
            });
        });
    });

});


