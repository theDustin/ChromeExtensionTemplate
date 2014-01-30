/**
 *
 * @constructor
 * @augments ReferenceError
 */
Message.UnknownMessageTypeException = function () {
    ReferenceError.apply(this, arguments);
};

Message.UnknownMessageTypeException.prototype = Object.create(Error.prototype);
Message.UnknownMessageTypeException.prototype.constructor = Message.UnknownMessageTypeException;

/**
 * Create an UnknownMessageTypeException with the Message "Message with type <i>sMessageType</i> is unknown"
 *
 * @param {String} sMessageType The Type of the unkown Message
 *
 * @returns {Message.UnknownMessageTypeException}
 */
Message.UnknownMessageTypeException.createWithMessageType = function (sMessageType) {
    return new Message.UnknownMessageTypeException(["Message with type ", sMessageType, " already exists"].join(""));
};