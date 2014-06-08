/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'AccessEvent', function () {
    "use strict";

    var base = flock.CacheEvent,
        self = base.extend();

    /**
     * @name flock.AccessEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @returns {flock.AccessEvent}
     */

    /**
     * @class
     * @extends flock.CacheEvent
     */
    flock.AccessEvent = self
        .addConstants(/** @lends flock.AccessEvent */{
            /** @constant */
            EVENT_CACHE_ACCESS: 'cache-access'
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event.addSurrogate(flock, 'AccessEvent', function (eventName, eventSpace) {
        return flock.CacheEventSpace.isBaseOf(eventSpace) &&
               eventName === flock.AccessEvent.EVENT_CACHE_ACCESS;
    });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {flock.ChangeEvent} expr
         */
        isAccessEvent: function (expr) {
            return flock.AccessEvent.isBaseOf(expr);
        },

        /**
         * @param {flock.ChangeEvent} expr
         */
        isAccessEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   flock.AccessEvent.isBaseOf(expr);
        }
    });
}());
