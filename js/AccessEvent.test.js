/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Access Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {flock.AccessEvent} */ flock.AccessEvent.create(eventSpace);

        equal(event.eventName, flock.AccessEvent.EVENT_NAME_ACCESS, "Event name");
    });
}());
