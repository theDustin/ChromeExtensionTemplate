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
 * @augments Error
 */
Message.DuplicatedMessageTypeException = function () {
    Error.apply(this, arguments);
};

Message.DuplicatedMessageTypeException.prototype = Object.create(Error.prototype);
Message.DuplicatedMessageTypeException.prototype.constructor = Message.DuplicatedMessageTypeException;

/**
 * Create an DuplicatedMessageTypeException with the Message "Message with type <i>sMessageType</i> already exists"
 *
 * @param {String} sMessageType The Type of the duplicated Message
 *
 * @returns {Message.DuplicatedMessageTypeException}
 */
Message.DuplicatedMessageTypeException.createWithMessageType = function (sMessageType) {
    return new Message.DuplicatedMessageTypeException(["Message with type ", sMessageType, " already exists"].join(""));
};
