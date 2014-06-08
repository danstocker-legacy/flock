/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Access Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {flock.AccessEvent} */ flock.AccessEvent.create(
                flock.AccessEvent.EVENT_CACHE_ACCESS,
                eventSpace);

        equal(event.eventName, flock.AccessEvent.EVENT_CACHE_ACCESS, "Event name");
    });

    test("Conversion from Event", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = evan.Event.create(
                flock.AccessEvent.EVENT_CACHE_ACCESS,
                eventSpace);

        ok(flock.AccessEvent.isBaseOf(event), "should return AccessEvent instance");
    });

    test("Spawning event", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = eventSpace.spawnEvent(flock.AccessEvent.EVENT_CACHE_ACCESS);

        ok(flock.AccessEvent.isBaseOf(event), "should return AccessEvent instance");
    });
}());
