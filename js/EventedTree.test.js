/*global dessert, troop, sntls, evan, flock */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("EventedTree");

    test("Instantiation", function () {
        var tree = flock.EventedTree.create();

        ok(tree.eventSpace.isA(flock.CacheEventSpace), "should set event space");
    });

    test("Conversion from Hash", function () {
        var hash = sntls.Hash.create(),
            tree = hash.toEventedTree();

        ok(tree.isA(flock.EventedTree), "should return EventedTree instance");
    });

    test("Conversion from Array", function () {
        var buffer = [1, 2, 3, 4, 5],
            tree = buffer.toEventedTree();

        ok(tree.isA(flock.EventedTree), "should return EventedTree instance");
        strictEqual(tree.items, buffer, "should set array as Tree buffer");
    });

    test("Getting node", function () {
        expect(4);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath();

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should call base' getNode");
                strictEqual(targetPath, path, "should get target node");
                return undefined;
            }
        });

        evan.Event.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger access event on specified path");
                return this;
            }
        });

        // path does not exist in empty tree, access event will fire
        equal(typeof tree.getNode(path), 'undefined', "should fetch node");

        sntls.Tree.removeMocks();
        evan.Event.removeMocks();
    });

    // TODO: Add case where Tree.getSafeNode() returns value other than undefined.
    test("Getting safe node", function () {
        expect(7);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            newNode = {};

        function handler(targetPath, afterNode) {
            strictEqual(targetPath, path, "should call handler with specified path");
            strictEqual(afterNode, newNode, "should pass new node to handler");
        }

        sntls.Tree.addMocks({
            getSafeNode: function (targetPath, handler) {
                strictEqual(targetPath, path, "should fetch safe node from specified path");
                handler(path, newNode);
                return undefined;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                equal(typeof this.beforeValue, 'undefined', "should set before value to undefined");
                strictEqual(this.afterValue, newNode, "should set after value to created node");
            }
        });

        equal(typeof tree.getSafeNode(path, handler), 'undefined', "should fetch undefined");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    test("Node insertion", function () {
        expect(12);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            afterNode = {};

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return undefined; // specified path is empty
            },

            setNode: function (targetPath, node) {
                strictEqual(this, tree, "should set node on current tree");
                strictEqual(targetPath, path, "should pass specified path to setter");
                strictEqual(node, afterNode, "should pass specified node to setter");
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                equal(typeof this.beforeValue, 'undefined', "should set before value to undefined");
                strictEqual(this.afterValue, afterNode, "should set after value to specified node");
                return this;
            }
        });

        strictEqual(tree.setNode(path, afterNode), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    // TODO: Add case where afterNode === beforeNode.
    test("Setting node", function () {
        expect(12);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            beforeNode = {},
            afterNode = {};

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return beforeNode;
            },

            setNode: function (targetPath, node) {
                strictEqual(this, tree, "should set node on current tree");
                strictEqual(targetPath, path, "should pass specified path to setter");
                strictEqual(node, afterNode, "should pass specified node to setter");
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                strictEqual(this.beforeValue, beforeNode, "should set before value to previous node");
                strictEqual(this.afterValue, afterNode, "should set after value to specified node");
                return this;
            }
        });

        strictEqual(tree.setNode(path, afterNode), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    // TODO: Add case where afterNode === beforeNode.
    test("Setting node with broadcast", function () {
        expect(12);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            beforeNode = {},
            afterNode = {};

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return beforeNode;
            },

            setNode: function (targetPath, node) {
                strictEqual(this, tree, "should set node on current tree");
                strictEqual(targetPath, path, "should pass specified path to setter");
                strictEqual(node, afterNode, "should pass specified node to setter");
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            broadcastSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                strictEqual(this.beforeValue, beforeNode, "should set before value to previous node");
                strictEqual(this.afterValue, afterNode, "should set after value to specified node");
                return this;
            }
        });

        strictEqual(tree.setNodeWithBroadcast(path, afterNode), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    test("Getting or setting node", function () {
        expect(8);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            newNode = {};

        function nodeGenerator() {
            return newNode;
        }

        function handler(targetPath, afterNode) {
            strictEqual(targetPath, path, "should call handler with specified path");
            strictEqual(afterNode, newNode, "should pass new node to handler");
        }

        sntls.Tree.addMocks({
            getOrSetNode: function (targetPath, generator, handler) {
                strictEqual(targetPath, path, "should call super with specified path");
                strictEqual(generator, nodeGenerator, "should pass generator function to super");
                handler(path, generator());
                return generator();
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                equal(typeof this.beforeValue, 'undefined', "should set before value to undefined");
                strictEqual(this.afterValue, newNode, "should set after value to created node");
            }
        });

        strictEqual(tree.getOrSetNode(path, nodeGenerator, handler), newNode, "should return generated node");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    // TODO: Add case where afterNode === beforeNode.
    test("Node removal", function () {
        expect(11);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            beforeNode = {};

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return beforeNode;
            },

            unsetNode: function (targetPath) {
                strictEqual(this, tree, "should call super");
                strictEqual(targetPath, path, "should pass specified path to super");
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                strictEqual(this.beforeValue, beforeNode, "should set before value to previous node");
                equal(typeof this.afterValue, 'undefined', "should set after value to undefined");
                return this;
            }
        });

        strictEqual(tree.unsetNode(path), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    // TODO: Add case where splice === true.
    test("Key removal", function () {
        expect(12);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            beforeNode = {};

        function handler(targetPath) {
            strictEqual(targetPath, path, "should call handler with specified path");
        }

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return beforeNode;
            },

            unsetKey: function (targetPath, splice, handler) {
                strictEqual(this, tree, "should call super");
                strictEqual(targetPath, path, "should pass specified path to super");
                handler(targetPath, undefined);
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                strictEqual(this.beforeValue, beforeNode, "should set before value to previous node");
                equal(typeof this.afterValue, 'undefined', "should set after value to undefined");
                return this;
            }
        });

        strictEqual(tree.unsetKey(path, false, handler), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    // TODO: Add case where splice === true.
    test("Path removal", function () {
        expect(12);

        var tree = flock.EventedTree.create(),
            path = 'foo>bar'.toPath(),
            beforeNode = {};

        function handler(targetPath) {
            strictEqual(targetPath, path, "should call handler with specified path");
        }

        sntls.Tree.addMocks({
            getNode: function (targetPath) {
                strictEqual(this, tree, "should fetch node from current tree");
                strictEqual(targetPath, path, "should pass specified path to getter");
                return beforeNode;
            },

            unsetPath: function (targetPath, splice, handler) {
                strictEqual(this, tree, "should call super");
                strictEqual(targetPath, path, "should pass specified path to super");
                handler(targetPath, undefined);
                return this;
            }
        });

        flock.ChangeEvent.addMocks({
            triggerSync: function (eventPath) {
                strictEqual(eventPath, path, "should trigger change event on specified path");
                strictEqual(this.beforeValue, beforeNode, "should set before value to previous node");
                equal(typeof this.afterValue, 'undefined', "should set after value to undefined");
                return this;
            }
        });

        strictEqual(tree.unsetPath(path, false, handler), tree, "should be chainable");

        sntls.Tree.removeMocks();
        flock.ChangeEvent.removeMocks();
    });

    test("Subscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create();

        evan.EventSpace.addMocks({
            subscribeTo: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName', "should pass event name to super");
                equal(eventPath, 'eventPath', "should pass event path to super");
                equal(handler, 'handler', "should pass handler to super");
            }
        });

        strictEqual(tree.subscribeTo('eventName', 'eventPath', 'handler'), tree, "should be chainable");

        evan.EventSpace.removeMocks();
    });

    test("Unsubscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create();

        evan.EventSpace.addMocks({
            unsubscribeFrom: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName', "should pass event name to super");
                equal(eventPath, 'eventPath', "should pass event path to super");
                equal(handler, 'handler', "should pass handler to super");
            }
        });

        strictEqual(tree.unsubscribeFrom('eventName', 'eventPath', 'handler'), tree, "should be chainable");

        evan.EventSpace.removeMocks();
    });

    test("One time unsubscription proxy", function () {
        expect(4);

        var tree = flock.EventedTree.create(),
            oneTimeHandler = function () {};

        evan.EventSpace.addMocks({
            subscribeToUntilTriggered: function (eventName, eventPath, handler) {
                equal(eventName, 'eventName', "should pass event name to super");
                equal(eventPath, 'eventPath', "should pass event path to super");
                equal(handler, 'handler', "should pass handler to super");
                return oneTimeHandler;
            }
        });

        strictEqual(tree.subscribeToUntilTriggered('eventName', 'eventPath', 'handler'),
            oneTimeHandler,
            "should return subscribed handler");

        evan.EventSpace.removeMocks();
    });

    test("Delegation proxy", function () {
        expect(5);

        var tree = flock.EventedTree.create(),
            delegateHandler = function () {};

        evan.EventSpace.addMocks({
            delegateSubscriptionTo: function (eventName, capturePath, delegatePath, handler) {
                equal(eventName, 'eventName', "should pass event name to super");
                equal(capturePath, 'capturePath', "should pass capture path to super");
                equal(delegatePath, 'delegatePath', "should pass delegate path to super");
                equal(handler, 'handler', "should pass handler to super");
                return delegateHandler;
            }
        });

        strictEqual(tree.delegateSubscriptionTo('eventName', 'capturePath', 'delegatePath', 'handler'),
            delegateHandler,
            "should return delegate handler");

        evan.EventSpace.removeMocks();
    });
}());
