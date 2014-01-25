/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("Evented Tree");

    test("Instantiation", function () {
        var tree = flock.EventedTree.create();

        ok(tree.eventSpace.isA(evan.EventSpace), "Is event space");
    });

    test("Type conversion", function () {
        var hash = sntls.Hash.create(),
            tree = hash.toEventedTree();

        ok(tree.isA(flock.EventedTree), "Is evented tree");
    });

    test("Array conversion", function () {
        var buffer = [1, 2, 3, 4, 5],
            tree = buffer.toEventedTree();

        ok(tree.isA(flock.EventedTree), "Is evented tree");
        strictEqual(tree.items, buffer, "Tree buffer");
    });

    test("Get node", function () {
        expect(3);

        var tree = flock.EventedTree.create(),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.AccessEvent));
                equal(path.toString(), 'foo>bar');
            }
        });

        // path does not exist in empty tree, access event will fire
        result = tree.getNode('foo>bar'.toPath());

        equal(typeof result, 'undefined', "Node fetched");

        evan.Event.removeMocks();
    });

    test("Get safe node", function () {
        expect(7);

        var tree = flock.EventedTree.create(),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(typeof this.before, 'undefined');
                deepEqual(this.after, {});
                ok(this.isInsert());
                ok(!this.isDelete());
            }
        });

        result = tree.getSafeNode('foo>bar'.toPath());

        deepEqual(result, {}, "Node fetched");

        evan.Event.removeMocks();
    });

    test("Insert node", function () {
        expect(6);

        var tree = flock.EventedTree.create(),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                if (path.toString() === 'foo>bar') {
                    ok(this.isA(flock.ChangeEvent));
                    equal(typeof this.before, 'undefined');
                    equal(this.after, 'Hello');
                    ok(this.isInsert());
                    ok(!this.isDelete());
                }
            }
        });

        result = tree.setNode('foo>bar'.toPath(), 'Hello');

        strictEqual(result, tree, "Is chainable");

        evan.Event.removeMocks();
    });

    test("Change node", function () {
        expect(7);

        var tree = flock.EventedTree.create({
                foo: {
                    bar: "Hello"
                }
            }),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(this.before, 'Hello');
                equal(this.after, 'World');
                ok(!this.isInsert());
                ok(!this.isDelete());
            }
        });

        // will not fire
        result = tree.setNode('foo>bar'.toPath(), 'Hello');

        strictEqual(result, tree, "Is chainable");

        // will fire
        tree.setNode('foo>bar'.toPath(), 'World');

        evan.Event.removeMocks();
    });

    test("Change node w/ broadcast", function () {
        expect(7);

        var tree = flock.EventedTree.create({
                foo: {
                    bar: "Hello"
                }
            }),
            result;

        evan.Event.addMocks({
            broadcastSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(this.before, 'Hello');
                equal(this.after, 'World');
                ok(!this.isInsert());
                ok(!this.isDelete());
            }
        });

        // will not fire
        result = tree.setNodeWithBroadcast('foo>bar'.toPath(), 'Hello');

        strictEqual(result, tree, "Is chainable");

        // will fire
        tree.setNodeWithBroadcast('foo>bar'.toPath(), 'World');

        evan.Event.removeMocks();
    });

    test("Get or set node", function () {
        expect(6);

        var tree = flock.EventedTree.create(),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                if (path.toString() === 'foo>bar') {
                    ok(this.isA(flock.ChangeEvent));
                    equal(typeof this.before, 'undefined');
                    equal(this.after, 'Hello');
                    ok(this.isInsert());
                    ok(!this.isDelete());
                }
            }
        });

        result = tree.getOrSetNode('foo>bar'.toPath(), function () {return 'Hello';});

        equal(result, "Hello");

        evan.Event.removeMocks();
    });

    test("Unset node", function () {
        expect(7);

        var tree = flock.EventedTree.create({
                foo: {
                    bar: "Hello"
                }
            }),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(this.before, 'Hello');
                equal(typeof this.after, 'undefined');
                ok(!this.isInsert());
                ok(this.isDelete());
            }
        });

        result = tree.unsetNode('foo>bar'.toPath());

        strictEqual(result, tree, "Is chainable");

        evan.Event.removeMocks();
    });

    test("Unset key", function () {
        expect(7);

        var tree = flock.EventedTree.create({
                foo: {
                    bar: "Hello"
                }
            }),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(this.before, 'Hello');
                equal(typeof this.after, 'undefined');
                ok(!this.isInsert());
                ok(this.isDelete());
            }
        });

        result = tree.unsetKey('foo>bar'.toPath());

        strictEqual(result, tree, "Is chainable");

        evan.Event.removeMocks();
    });

    // TODO: Add test case for .unsetKey w/ splice

    test("Unset path", function () {
        expect(7);

        var tree = flock.EventedTree.create({
                foo: {
                    bar: {
                        baz: "Hello"
                    },
                    baz: {
                        bar: "World"
                    }
                }
            }),
            result;

        evan.Event.addMocks({
            triggerSync: function (path) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                notEqual(typeof this.before, 'undefined');
                equal(typeof this.after, 'undefined');
                ok(!this.isInsert());
                ok(this.isDelete());
            }
        });

        result = tree.unsetPath('foo>bar>baz'.toPath());

        strictEqual(result, tree, "Is chainable");

        evan.Event.removeMocks();
    });

    // TODO: Add test case for .unsetPath w/ splice

    test("Subscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create(),
            result;

        evan.EventSpace.addMocks({
            subscribeTo: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName');
                equal(eventPath, 'eventPath');
                equal(handler, 'handler');
            }
        });

        result = tree.subscribeTo('eventName', 'eventPath', 'handler');

        strictEqual(result, tree, "Is chainable");

        evan.EventSpace.removeMocks();
    });

    test("Unsubscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create(),
            result;

        evan.EventSpace.addMocks({
            unsubscribeFrom: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName');
                equal(eventPath, 'eventPath');
                equal(handler, 'handler');
            }
        });

        result = tree.unsubscribeFrom('eventName', 'eventPath', 'handler');

        strictEqual(result, tree, "Is chainable");

        evan.EventSpace.removeMocks();
    });

    test("Unsubscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create(),
            oneTimeHandler = function () {},
            result;

        evan.EventSpace.addMocks({
            subscribeToUntilTriggered: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName');
                equal(eventPath, 'eventPath');
                equal(handler, 'handler');
                return oneTimeHandler;
            }
        });

        result = tree.subscribeToUntilTriggered('eventName', 'eventPath', 'handler');

        strictEqual(result, oneTimeHandler, "Returns handler");

        evan.EventSpace.removeMocks();
    });

    test("Delegation proxy", function () {
        expect(5);

        var tree = flock.EventedTree.create(),
            delegateHandler = function () {},
            result;

        evan.EventSpace.addMocks({
            delegateSubscriptionTo: function (eventName, capturePath, delegatePath, handler) {
                equal(eventName, 'eventName');
                equal(capturePath, 'capturePath');
                equal(delegatePath, 'delegatePath');
                equal(handler, 'handler');
                return delegateHandler;
            }
        });

        result = tree.delegateSubscriptionTo('eventName', 'capturePath', 'delegatePath', 'handler');

        strictEqual(result, delegateHandler, "Returns handler");

        evan.EventSpace.removeMocks();
    });
}());
