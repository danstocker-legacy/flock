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
        .addPrivateMethods(/** @lends flock.ChangeEvent# */{
            /**
             * Updates flags to reflect the current before-after values.
             * @private
             */
            _updateFlags: function () {
                this.data.isInsert = this.isInsert();
                this.data.isDelete = this.isDelete();
            }
        })
        .addMethods(/** @lends flock.ChangeEvent# */{
            /**
             * @param {evan.EventSpace} eventSpace Event space associated with event
             * @ignore
             */
            init: function (eventSpace) {
                base.init.call(this, eventSpace, this.EVENT_NAME_CHANGE);

                this.data = {
                    before  : undefined,
                    after   : undefined,
                    isInsert: undefined,
                    isDelete: undefined
                };

                this.setData(this.data);
            },

            /**
             * Sets event load before the change.
             * @param {*} value
             * @returns {flock.ChangeEvent}
             */
            setBefore: function (value) {
                this.data.before = value;
                this._updateFlags();
                return this;
            },

            /**
             * Sets event load after the change.
             * @param {*} value
             * @returns {flock.ChangeEvent}
             */
            setAfter: function (value) {
                this.data.after = value;
                this._updateFlags();
                return this;
            },

            /**
             * Tells whether change event represents an insert.
             * @returns {boolean}
             */
            isInsert: function () {
                var data = this.data;
                return typeof data.before === 'undefined' &&
                       typeof data.after !== 'undefined';
            },

            /**
             * Tells whether change event represents a deletion.
             * @returns {boolean}
             */
            isDelete: function () {
                var data = this.data;
                return typeof data.before !== 'undefined' &&
                       typeof data.after === 'undefined';
            },

            /**
             * @param {sntls.Path} targetPath Path on which to trigger event.
             * @return {flock.ChangeEvent}
             */
            triggerSync: function (targetPath) {
                base.triggerSync.call(this, targetPath, this.data);
                return this;
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
