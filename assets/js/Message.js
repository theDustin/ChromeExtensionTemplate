/**
 * Chrome-Extension-Template v1.0
 *
 * @author Dustin Breuer <dustin.breuer@thedust.in>
 * @version 1.0
 * @category chrome-extension
 * @licence MIT http://opensource.org/licenses/MIT
 */

/**
 * A simple message to communicate with scripts
 * @constructor
 */
function Message() {

    /**
     * The Type of the message
     * @type {string}
     */
    this.type = "undefined";

}

/**
 *
 * @type {Object.<String, Message>}
 * @private
 */
Message.__types = {};

/**
 * Create a new Message-Type (Factory)
 *
 * @param {String} sMessageType The message type as String
 * @param {Object.<String, *>} [mDefaultValues=null]
 *
 * @returns {Message}
 *
 * @throws {Message.DuplicatedMessageTypeException}
 */
Message.createMessageType = function (sMessageType, mDefaultValues) {

    if (Message.__types[sMessageType]) {
        throw Message.DuplicatedMessageTypeException.createWithMessageType(sMessageType);
    }

    /**
     *
     * @extends {Message}
     * @private
     */
    function _oNewMessage() {
        Message.call(this);

        this.type = sMessageType;

        if (mDefaultValues) {
            for (var _sKey in mDefaultValues) {
                //noinspection JSUnfilteredForInLoop
                this[_sKey] = mDefaultValues[_sKey];
            }
        }
    }

    _oNewMessage.prototype = Object.create(Message.prototype);
    _oNewMessage.prototype.constructor = _oNewMessage;

    Message.__types[sMessageType] = _oNewMessage;

    return _oNewMessage;
};

/**
 * Create a Message from type <i>sMessageType</i>
 *
 * @param {String} sMessageType
 *
 * @returns {Message}
 *
 * @throws {Message.UnknownMessageTypeException} Unknown message type
 */
Message.createMessageByType = function (sMessageType) {
    if (!Message.__types[sMessageType]) {
        throw Message.UnknownMessageTypeException.createWithMessageType(sMessageType);
    }

    return new Message.__types[sMessageType];
};

/**
 * Create a Message from type <i>sMessageType</i> with the values <i>mValues</i>
 *
 * @param {String} sMessageType The message type as String
 * @param {Object.<String, *>} [mValues=null]
 *
 * @returns {Message}
 *
 * @throws {Message.UnknownMessageTypeException} Unknown message type
 */
Message.createMessage = function (sMessageType, mValues) {
    var _oMessage = Message.createMessageByType(sMessageType);

    if (mValues) {
        for (var _sKey in mValues) {
            //noinspection JSUnfilteredForInLoop
            _oMessage[_sKey] = mValues[_sKey];
        }
    }

    return _oMessage;
};

