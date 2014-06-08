/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Change Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {flock.ChangeEvent} */ flock.ChangeEvent.create(
                flock.ChangeEvent.EVENT_CACHE_CHANGE,
                eventSpace);

        equal(typeof event.beforeValue, 'undefined', "should set before value to undefined");
        equal(typeof event.afterValue, 'undefined', "should set After value is not defined");
    });

    test("Conversion from Event", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = evan.Event.create(flock.ChangeEvent.EVENT_CACHE_CHANGE, eventSpace);

        ok(flock.ChangeEvent.isBaseOf(event), "should return ChangeEvent instance");
    });

    test("Spawning event", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE);

        ok(flock.ChangeEvent.isBaseOf(event), "should return ChangeEvent instance");
    });

    test("Before value setter", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE),
            result;

        result = event.setBefore('foo');

        strictEqual(result, event, "should be chainable");
        equal(event.beforeValue, 'foo', "should set before value");
    });

    test("After value setter", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE),
            result;

        result = event.setAfter('bar');

        strictEqual(result, event, "should be chainable");
        equal(event.afterValue, 'bar', "should set after value");
    });

    test("Insertion tester", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event;

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE);
        ok(!event.isInsert(), "should return false on no before nor after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('foo');
        ok(!event.isInsert(), "should return false on before but no after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setAfter('bar');
        ok(event.isInsert(), "should return true on no before but after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('foo')
            .setAfter('bar');
        ok(!event.isInsert(), "should return false on before and after");
    });

    test("Deletion tester", function () {
        var eventSpace = flock.CacheEventSpace.create(),
            event;

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE);
        ok(!event.isDelete(), "should return false on no before nor after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('foo');
        ok(event.isDelete(), "should return true on before but no after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setAfter('bar');
        ok(!event.isDelete(), "should return false on no before but after");

        event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('foo')
            .setAfter('bar');
        ok(!event.isDelete(), "should return false on before and after");
    });

    test("Triggering event", function () {
        expect(4);

        var eventSpace = flock.CacheEventSpace.create(),
            beforeValue = {},
            afterValue = {},
            event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                .setBefore(beforeValue)
                .setAfter(afterValue),
            path = 'foo>bar'.toPath(),
            customPayload = {};

        evan.Event.addMocks({
            triggerSync: function (eventPath, payload) {
                strictEqual(eventPath, path, "should trigger event on specified path");
                strictEqual(this.beforeValue, beforeValue, "should set before value on event");
                strictEqual(this.afterValue, afterValue, "should set after value on event");
                strictEqual(payload, customPayload, "should pass custom payload to trigger");
            }
        });

        event.triggerSync(path, customPayload);

        evan.Event.removeMocks();
    });

    test("Broadcasting event", function () {
        expect(4);

        var eventSpace = flock.CacheEventSpace.create(),
            beforeValue = {},
            afterValue = {},
            event = eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                .setBefore(beforeValue)
                .setAfter(afterValue),
            path = 'foo>bar'.toPath(),
            customPayload = {};

        evan.Event.addMocks({
            broadcastSync: function (eventPath, payload) {
                strictEqual(eventPath, path, "should trigger event on specified path");
                strictEqual(this.beforeValue, beforeValue, "should set before value on event");
                strictEqual(this.afterValue, afterValue, "should set after value on event");
                strictEqual(payload, customPayload, "should pass custom payload to trigger");
            }
        });

        event.broadcastSync(path, customPayload);

        evan.Event.removeMocks();
    });
}());
