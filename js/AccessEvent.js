/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'AccessEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name flock.AccessEvent.create
     * @function
     * @returns {flock.AccessEvent}
     */

    /**
     * @class
     * @extends evan.Event
     */
    flock.AccessEvent = self
        .addConstants(/** @lends flock.AccessEvent */{
            EVENT_NAME_ACCESS: 'eventAccess'
        })
        .addMethods(/** @lends flock.ChangeEvent# */{
            /**
             * @param {evan.EventSpace} eventSpace Event space associated with event
             * @ignore
             */
            init: function (eventSpace) {
                base.init.call(this, eventSpace, this.EVENT_NAME_ACCESS);
            }
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
