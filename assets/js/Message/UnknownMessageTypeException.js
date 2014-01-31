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
 * @augments ReferenceError
 */
Message.UnknownMessageTypeException = function (sMsg) {
    ReferenceError.call(this);
    this.message = sMsg;
};

Message.UnknownMessageTypeException.prototype = Object.create(Error.prototype);
Message.UnknownMessageTypeException.prototype.constructor = Message.UnknownMessageTypeException;

/**
 * Create an UnknownMessageTypeException with the Message "Message with type <i>sMessageType</i> is unknown"
 *
 * @param {String} sMessageType The Type of the unknown Message
 *
 * @returns {Message.UnknownMessageTypeException}
 */
Message.UnknownMessageTypeException.createWithMessageType = function (sMessageType) {
    return new Message.UnknownMessageTypeException(["Message with type ", sMessageType, " already exists"].join(""));
};