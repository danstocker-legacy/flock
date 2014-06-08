/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'CacheEventSpace', function () {
    "use strict";

    /**
     * Instantiates class.
     * @name flock.CacheEventSpace.create
     * @function
     * @return {flock.CacheEventSpace}
     */

    /**
     * Tree data store specific event space.
     * @class
     * @extends troop.Base
     */
    flock.CacheEventSpace = evan.EventSpace.extend();
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isCacheEventSpace: function (expr) {
            return flock.CacheEventSpace.isPrototypeOf(expr);
        },

        isCacheEventSpaceOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   flock.CacheEventSpace.isPrototypeOf(expr);
        }
    });
}());