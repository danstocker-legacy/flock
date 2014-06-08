/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'CacheEvent', function () {
    "use strict";

    /**
     * @name flock.CacheEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @returns {flock.CacheEvent}
     */

    /**
     * Base class for all cache (EventedTree) related events.
     * @class
     * @extends evan.Event
     */
    flock.CacheEvent = evan.Event.extend();
});
