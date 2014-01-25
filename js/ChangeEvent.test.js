/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Change Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {flock.ChangeEvent} */ flock.ChangeEvent.create(eventSpace);

        equal(event.eventName, flock.ChangeEvent.EVENT_NAME_CHANGE, "Event name");
        equal(typeof event.beforeValue, 'undefined', "Before value is not defined");
        equal(typeof event.afterValue, 'undefined', "After value is not defined");
    });

    test("Setting beforeValue value", function () {
        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace),
            result;

        result = event.setBefore('foo');

        strictEqual(result, event, "Is chainable");
        equal(event.beforeValue, 'foo');
    });

    test("Setting after value", function () {
        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace),
            result;

        result = event.setAfter('bar');

        strictEqual(result, event, "Is chainable");
        equal(event.afterValue, 'bar');
    });

    test("Flags", function () {
        var eventSpace = evan.EventSpace.create(),
            event;

        event = flock.ChangeEvent.create(eventSpace);
        ok(!event.isInsert(), "Unchanged not insert");
        ok(!event.isDelete(), "Unchanged not deletion");

        event = flock.ChangeEvent.create(eventSpace)
            .setBefore('foo');
        ok(!event.isInsert(), "Deletion not insert");
        ok(event.isDelete(), "Deletion");

        event = flock.ChangeEvent.create(eventSpace)
            .setAfter('bar');
        ok(event.isInsert(), "Insert");
        ok(!event.isDelete(), "Insert not deletion");
    });

    test("Triggering", function () {
        expect(4);

        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace)
                .setBefore('hello')
                .setAfter('world'),
            customData = {};

        evan.Event.addMocks({
            triggerSync: function (path, data) {
                equal(path.toString(), 'foo>bar');
                equal(this.beforeValue, 'hello');
                equal(this.afterValue, 'world');
                strictEqual(data, customData);
            }
        });

        event.triggerSync('foo>bar'.toPath(), customData);

        evan.Event.removeMocks();
    });

    test("Broadcasting", function () {
        expect(4);

        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace)
                .setBefore('hello')
                .setAfter('world'),
            customData = {};

        evan.Event.addMocks({
            broadcastSync: function (path, data) {
                equal(path.toString(), 'foo>bar');
                equal(this.beforeValue, 'hello');
                equal(this.afterValue, 'world');
                strictEqual(data, customData);
            }
        });

        event.broadcastSync('foo>bar'.toPath(), customData);

        evan.Event.removeMocks();
    });
}());
