/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'ChangeEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name flock.ChangeEvent.create
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @function
     * @returns {flock.ChangeEvent}
     */

    /**
     * Describes a change event occurring in a flock EventedTree.
     * @class
     * @extends evan.Event
     */
    flock.ChangeEvent = self
        .addConstants(/** @lends flock.ChangeEvent */{
            EVENT_NAME_CHANGE: 'eventChange'
        })
        .addMethods(/** @lends flock.ChangeEvent# */{
            /**
             * @param {evan.EventSpace} eventSpace Event space associated with event
             * @ignore
             */
            init: function (eventSpace) {
                base.init.call(this, this.EVENT_NAME_CHANGE, eventSpace);

                /**
                 * Node value before change.
                 * @type {*}
                 */
                this.beforeValue = undefined;

                /**
                 * Node value after change.
                 * @type {*}
                 */
                this.afterValue = undefined;
            },

            /**
             * Sets event load before the change.
             * @param {*} value
             * @returns {flock.ChangeEvent}
             */
            setBefore: function (value) {
                this.beforeValue = value;
                return this;
            },

            /**
             * Sets event load after the change.
             * @param {*} value
             * @returns {flock.ChangeEvent}
             */
            setAfter: function (value) {
                this.afterValue = value;
                return this;
            },

            /**
             * Tells whether change event represents an insert.
             * @returns {boolean}
             */
            isInsert: function () {
                return typeof this.beforeValue === 'undefined' &&
                       typeof this.afterValue !== 'undefined';
            },

            /**
             * Tells whether change event represents a deletion.
             * @returns {boolean}
             */
            isDelete: function () {
                return typeof this.beforeValue !== 'undefined' &&
                       typeof this.afterValue === 'undefined';
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {flock.ChangeEvent} expr
         */
        isChangeEvent: function (expr) {
            return flock.ChangeEvent.isBaseOf(expr);
        },

        /**
         * @param {flock.ChangeEvent} expr
         */
        isChangeEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   flock.ChangeEvent.isBaseOf(expr);
        }
    });
}());
