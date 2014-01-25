/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Change Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {flock.ChangeEvent} */ flock.ChangeEvent.create(eventSpace);

        equal(event.eventName, flock.ChangeEvent.EVENT_NAME_CHANGE, "Event name");
        ok(event.data instanceof Object, "Data load is object");
    });

    test("Setting before value", function () {
        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace),
            result;

        result = event.setBefore('foo');

        strictEqual(result, event, "Is chainable");
        equal(event.data.before, 'foo');
    });

    test("Setting after value", function () {
        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace),
            result;

        result = event.setAfter('bar');

        strictEqual(result, event, "Is chainable");
        equal(event.data.after, 'bar');
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
        ok(event.isDelete, "Deletion");

        event = flock.ChangeEvent.create(eventSpace)
            .setAfter('bar');
        ok(event.isInsert(), "Insert");
        ok(!event.isDelete(), "Insert not deletion");
    });

    test("Triggering", function () {
        expect(3);

        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace)
                .setBefore('hello')
                .setAfter('world'),
            result;

        evan.Event.addMocks({
            triggerSync: function (path, data) {
                equal(path.toString(), 'foo>bar');
                deepEqual(data, {
                    before  : 'hello',
                    after   : 'world',
                    isInsert: false,
                    isDelete: false
                });
            }
        });

        result = event.triggerSync('foo>bar'.toPath());

        strictEqual(result, event, "Is chainable");

        evan.Event.removeMocks();
    });

    test("Broadcasting", function () {
        expect(3);

        var eventSpace = evan.EventSpace.create(),
            event = flock.ChangeEvent.create(eventSpace)
                .setBefore('hello')
                .setAfter('world'),
            result;

        evan.Event.addMocks({
            broadcastSync: function (path, data) {
                equal(path.toString(), 'foo>bar');
                deepEqual(data, {
                    before  : 'hello',
                    after   : 'world',
                    isInsert: false,
                    isDelete: false
                });
            }
        });

        result = event.broadcastSync('foo>bar'.toPath());

        strictEqual(result, event, "Is chainable");

        evan.Event.removeMocks();
    });
}());
