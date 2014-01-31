/**
 * Chrome-Extension-Template v1.0
 *
 * @author Dustin Breuer <dustin.breuer@thedust.in>
 * @version 1.0
 * @category chrome-extension
 * @licence MIT http://opensource.org/licenses/MIT
 */

/**
 * A simple Storage to use in a chrome extension.
 * If no storage is forced, this class try to use chrome.storage.sync (when available), otherwise it will use window.localStorage
 *
 * @param {EasyStorage.Storage} [iForceStorageType=EasyStorage.Storage.None]
 * @constructor
 */
function EasyStorage(iForceStorageType) {

    /**
     *
     * @type {boolean}
     * @private
     */
    this._bUsedChromeStorage = !!(chrome && chrome.storage && chrome.storage.sync);

    /**
     *
     * @type {boolean}
     * @private
     */
    this._bUsedLocalStorage = !this._bUsedChromeStorage;

    /**
     *
     * @type {chrome.storage.StorageArea|Storage}
     * @private
     */
    this._oStorage = this._bUsedChromeStorage ? chrome.storage.sync : window.localStorage;

    if (iForceStorageType) {
        switch (iForceStorageType) {
            case EasyStorage.Storage.Chrome:
            case EasyStorage.Storage.ChromeSync:
                this._bUsedChromeStorage = true;
                this._bUsedLocalStorage = false;
                this._oStorage = chrome.storage.sync;
                break;
            case EasyStorage.Storage.ChromeLocal:
                this._bUsedChromeStorage = true;
                this._bUsedLocalStorage = false;
                this._oStorage = chrome.storage.local;
                break;
            case EasyStorage.Storage.ChromeManaged:
                this._bUsedChromeStorage = true;
                this._bUsedLocalStorage = false;
                this._oStorage = chrome.storage.managed;
                break;
            case EasyStorage.Storage.Window:
            case EasyStorage.Storage.WindowLocal:
                this._bUsedChromeStorage = false;
                this._bUsedLocalStorage = true;
                this._oStorage = window.localStorage;
                break;
            case EasyStorage.Storage.WindowSession:
                this._bUsedChromeStorage = false;
                this._bUsedLocalStorage = true;
                this._oStorage = window.sessionStorage;
                break;
        }
    }
}

/**
 * An enum with Storages to force
 *
 * @enum {Number}
 * @readonly
 */
EasyStorage.Storage = {
    /**
     * Force non storage (default)
     */
    None : 0,
    /**
     * Force the EasyStorage to use the default chrome Storage (chrome.storage.sync)
     */
    Chrome : 1,
    /**
     * Force the EasyStorage to use the chrome.storage.sync Storage
     */
    ChromeSync : 2,
    /**
     * Force the EasyStorage to use the chrome.storage.local Storage
     */
    ChromeLocal : 3,
    /**
     * Force the EasyStorage to use the chrome.storage.managed Storage
     * Items in the managed storage area are set by the domain administrator, and are read-only for the extension; trying to modify this namespace results in an error.
     */
    ChromeManaged : 4,
    /**
     * Force the EasyStorage to use the default window Storage (window.localStorage)
     */
    Window : 5,
    /**
     * Force the EasyStorage to use the window.localStorage Storage
     */
    WindowLocal : 6,
    /**
     * Force the EasyStorage to use the window.sessionStorage Storage
     */
    WindowSession : 7
};

/**
 *
 * @returns {boolean}
 */
EasyStorage.prototype.usedChromeStorage = function () {
    return this._bUsedChromeStorage;
};

/**
 *
 * @returns {boolean}
 */
EasyStorage.prototype.usedLocalStorage = function () {
    return this._bUsedLocalStorage;
};

/**
 * Returns the EasyStorage.Storage-Value that indicate the current Storage
 *
 * @returns {EasyStorage.Storage}
 */
EasyStorage.prototype.getForceStorageValue = function () {

    switch (this._oStorage) {
        case window.localStorage:
            return EasyStorage.Storage.WindowLocal;

        case window.sessionStorage:
            return EasyStorage.Storage.WindowSession;

        case chrome.storage.local:
            return EasyStorage.Storage.ChromeLocal;

        case chrome.storage.sync:
            return EasyStorage.Storage.ChromeSync;

        case chrome.storage.managed:
            return EasyStorage.Storage.ChromeManaged;
    }

    return EasyStorage.Storage.None;
};

/**
 * Gets one or more items from storage
 *
 * @param {string|string[]|Object.<String, *>|null} mKeys A single key to get, list of keys to get, or a dictionary specifying default values (see description of the object). An empty list or object will return an empty result object. Pass in null to get the entire contents of storage
 * @param {Function} oCallback Callback with storage items, or on failure (in which case runtime.lastError will be set)
 */
EasyStorage.prototype.get = function (mKeys, oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.get(mKeys, oCallback);

    } else if (mKeys === null) {
        this.getEntireStorage(oCallback);

    } else {
        if (mKeys instanceof String) {
            oCallback.call(this, JSON.parse(this._oStorage.getItem(mKeys)));
        } else {
            var _oCallbackData = {};

            if (mKeys instanceof Array) {
                mKeys.forEach(function (sKey) {
                    _oCallbackData[sKey] = JSON.parse(this._oStorage.getItem(sKey));
                }, this);
            } else {
                for (var _sKey in mKeys) {
                    _oCallbackData[_sKey] = JSON.parse(this._oStorage.getItem(_sKey)) || mKeys[_sKey];
                }
            }

            oCallback.call(this, _oCallbackData);
        }
    }
};

/**
 * Gets all items from storage
 *
 * @param {Function} oCallback Callback with storage items, or on failure (in which case runtime.lastError will be set)
 */
EasyStorage.prototype.getEntireStorage = function (oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.get(null, oCallback);
    } else {
        var _oRet = {}, _sKey;

        for (_sKey in this._oStorage) {
            _oRet[_sKey] = JSON.parse(this._oStorage[_sKey]);
        }

        oCallback.call(this, _oRet);
    }
};

/**
 * Gets the amount of space (in bytes) being used by one or more items
 * Returns always -1 if a window.Storage Storage will be used
 *
 * @param {string|string[]|null} mKeys A single key or list of keys to get the total usage for. An empty list will return 0. Pass in null to get the total usage of all of storage
 * @param {Function} oCallback Callback with the amount of space being used by storage, or on failure (in which case runtime.lastError will be set)
 *
 * @todo Calculate the size of localStorage
 */
EasyStorage.prototype.getBytesInUse = function (mKeys, oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.getBytesInUse(mKeys, oCallback);
    } else {
        oCallback.call(this, -1);
    }
};

/**
 * Sets multiple items
 *
 * @param {Object.<String, *>} oItems An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
 * @param {Function} oCallback Callback on success, or on failure (in which case runtime.lastError will be set)
 */
EasyStorage.prototype.set = function (oItems, oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.set(oItems, oCallback);
    } else {
        for (var _sKey in oItems) {
            this._oStorage.setItem(_sKey, JSON.stringify(oItems[_sKey]));
        }

        oCallback.call(this);
    }
};

/**
 * Removes one or more items from storage
 *
 * @param {String|String[]|Object.<String, *>} mKeys A single key or a list of keys for items to remove
 * @param {Function} oCallback Callback on success, or on failure (in which case runtime.lastError will be set)
 */
EasyStorage.prototype.remove = function (mKeys, oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.remove(mKeys, oCallback);
    } else {
        if (mKeys instanceof String) {
            this._oStorage.removeItem(mKeys);
        } else {
            if (!mKeys instanceof Array) {
                mKeys = Object.keys(mKeys);
            }

            mKeys.forEach(this._oStorage.removeItem);
        }

        oCallback.call(this);
    }
};

/**
 * Removes all items from storage
 *
 * @param {Function} oCallback Callback on success, or on failure (in which case runtime.lastError will be set)
 */
EasyStorage.prototype.clear = function (oCallback) {
    if (this._bUsedChromeStorage) {
        this._oStorage.clear(oCallback);
    } else {
        this._oStorage.clear();
        oCallback.call(this);
    }
};
