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
            triggerSync: function (path, data) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(typeof data.before, 'undefined');
                deepEqual(data.after, {});
                ok(data.isInsert);
                ok(!data.isDelete);
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
            triggerSync: function (path, data) {
                if (path.toString() === 'foo>bar') {
                    ok(this.isA(flock.ChangeEvent));
                    equal(typeof data.before, 'undefined');
                    equal(data.after, 'Hello');
                    ok(data.isInsert);
                    ok(!data.isDelete);
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
            triggerSync: function (path, data) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(data.before, 'Hello');
                equal(data.after, 'World');
                ok(!data.isInsert);
                ok(!data.isDelete);
            }
        });

        // will not fire
        result = tree.setNode('foo>bar'.toPath(), 'Hello');

        strictEqual(result, tree, "Is chainable");

        // will fire
        tree.setNode('foo>bar'.toPath(), 'World');

        evan.Event.removeMocks();
    });

    test("Get or set node", function () {
        expect(6);

        var tree = flock.EventedTree.create(),
            result;

        evan.Event.addMocks({
            triggerSync: function (path, data) {
                if (path.toString() === 'foo>bar') {
                    ok(this.isA(flock.ChangeEvent));
                    equal(typeof data.before, 'undefined');
                    equal(data.after, 'Hello');
                    ok(data.isInsert);
                    ok(!data.isDelete);
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
            triggerSync: function (path, data) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(data.before, 'Hello');
                equal(typeof data.after, 'undefined');
                ok(!data.isInsert);
                ok(data.isDelete);
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
            triggerSync: function (path, data) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                equal(data.before, 'Hello');
                equal(typeof data.after, 'undefined');
                ok(!data.isInsert);
                ok(data.isDelete);
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
            triggerSync: function (path, data) {
                ok(this.isA(flock.ChangeEvent));
                equal(path.toString(), 'foo>bar');
                notEqual(typeof data.before, 'undefined');
                equal(typeof data.after, 'undefined');
                ok(!data.isInsert);
                ok(data.isDelete);
            }
        });

        result = tree.unsetPath('foo>bar>baz'.toPath());

        strictEqual(result, tree, "Is chainable");

        evan.Event.removeMocks();
    });

    // TODO: Add test case for .unsetPath w/ splice
}());
