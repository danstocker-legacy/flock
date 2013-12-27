/*global dessert, troop, sntls, evan, flock */
troop.postpone(flock, 'EventedTree', function () {
    "use strict";

    var base = sntls.Tree,
        self = base.extend();

    /**
     * @name flock.EventedTree.create
     * @function
     * @param {object} [items]
     * @returns {flock.EventedTree}
     */

    /**
     * Evented version of `sntls.Tree`. Whenever a node is changed (by value) the tree emits a `ChangeEvent`.
     * When a node is attempted to be read but the path does not exist, an `AccessEvent` is emitted.
     * Offers subscription methods. Works like `sntls.Tree` in all other regards.
     * @class
     * @extends sntls.Tree
     */
    flock.EventedTree = self
        .addMethods(/** @lends flock.EventedTree# */{
            /**
             * @param {object} [items]
             * @ignore
             */
            init: function (items) {
                base.init.call(this, items);

                /** @type {evan.EventSpace} */
                this.eventSpace = evan.EventSpace.create();
            },

            /**
             * Node may not exist.
             * @param {sntls.Path} path Path to node
             * @returns {*} Whatever value is found at path
             */
            getNode: function (path) {
                var node = base.getNode.call(this, path);

                if (typeof node === 'undefined') {
                    // triggering event on no value
                    flock.AccessEvent.create(this.eventSpace)
                        .triggerSync(path);
                }

                return node;
            },

            /**
             * Might insert node.
             * @param {sntls.Path} path
             * @param {function} [handler] Callback receiving the path and value affected by change.
             * @returns {object}
             */
            getSafeNode: function (path, handler) {
                var that = this;
                return base.getSafeNode.call(this, path, function (path, afterNode) {
                    flock.ChangeEvent.create(that.eventSpace)
                        .setAfter(afterNode)
                        .triggerSync(path);

                    if (handler) {
                        handler(path, afterNode);
                    }
                });
            },

            /**
             * Changes node.
             * @param {sntls.Path} path Path to node
             * @param {*} value Node value to set
             * @returns {flock.EventedTree}
             */
            setNode: function (path, value) {
                var beforeNode = base.getNode.call(this, path);

                base.setNode.call(this, path, value);

                if (value !== beforeNode) {
                    flock.ChangeEvent.create(this.eventSpace)
                        .setBefore(beforeNode)
                        .setAfter(value)
                        .triggerSync(path);
                }

                return this;
            },

            /**
             * Might set node
             * @param {sntls.Path} path Path to node
             * @param {function} generator Generator function returning value
             * @param {function} [handler] Callback receiving the path and value affected by change.
             * @returns {*}
             */
            getOrSetNode: function (path, generator, handler) {
                var that = this;
                return base.getOrSetNode.call(this, path, generator, function (path, afterNode) {
                    flock.ChangeEvent.create(that.eventSpace)
                        .setAfter(afterNode)
                        .triggerSync(path);

                    if (handler) {
                        handler(path, afterNode);
                    }
                });
            },

            /**
             * Unsets node.
             * @param {sntls.Path} path
             * @returns {flock.EventedTree}
             */
            unsetNode: function (path) {
                var beforeNode = base.getNode.call(this, path);

                base.unsetNode.call(this, path);

                if (typeof beforeNode !== 'undefined') {
                    flock.ChangeEvent.create(this.eventSpace)
                        .setBefore(beforeNode)
                        .triggerSync(path);
                }

                return this;
            },

            /**
             * Unsets node.
             * @param {sntls.Path} path Path to node
             * @param {boolean} [splice=false] Whether to use splice when removing key from array.
             * @param {function} [handler] Callback receiving the path affected by change.
             * @returns {flock.EventedTree}
             */
            unsetKey: function (path, splice, handler) {
                var that = this,
                    beforeNode = base.getNode.call(this, path);

                base.unsetKey.call(this, path, splice, function (path, afterNode) {
                    if (afterNode) {
                        // FIXME: this is an approximation, as before-splice value is not available
                        flock.ChangeEvent.create(that.eventSpace)
                            .setBefore(afterNode)
                            .setAfter(afterNode)
                            .triggerSync(path);

                        if (handler) {
                            handler(path, afterNode);
                        }
                    } else {
                        flock.ChangeEvent.create(that.eventSpace)
                            .setBefore(beforeNode)
                            .triggerSync(path);

                        if (handler) {
                            handler(path);
                        }
                    }
                });

                return this;
            },

            /**
             * Unsets node.
             * @param {sntls.Path} path Datastore path
             * @param {boolean} [splice=false] Whether to use splice when removing key from array.
             * @param {function} [handler] Callback receiving the path affected by change.
             * @returns {flock.EventedTree}
             */
            unsetPath: function (path, splice, handler) {
                var that = this,
                    beforeNode = base.getNode.call(this, path);

                base.unsetPath.call(this, path, splice, function (path, affectedNode) {
                    // FIXME: this is an approximation, as before-splice value is not available
                    flock.ChangeEvent.create(that.eventSpace)
                        .setBefore(beforeNode)
                        .triggerSync(path);

                    if (handler) {
                        handler(path, affectedNode);
                    }
                });

                return this;
            },

            /**
             * Event subscription proxy.
             * @param {string} eventName
             * @param {sntls.Path} eventPath
             * @param {function} handler
             * @return {flock.EventedTree}
             * @see evan.EventSpace#subscribeTo
             */
            subscribeTo: function (eventName, eventPath, handler) {
                this.eventSpace.subscribeTo(eventName, eventPath, handler);
                return this;
            },

            /**
             * Event unsubscription proxy.
             * @param {string} eventName
             * @param {sntls.Path} eventPath
             * @param {function} [handler]
             * @return {flock.EventedTree}
             * @see evan.EventSpace#unsubscribeFrom
             */
            unsubscribeFrom: function (eventName, eventPath, handler) {
                this.eventSpace.unsubscribeFrom(eventName, eventPath, handler);
                return this;
            },

            /**
             * One-time subscription proxy.
             * @param {string} eventName
             * @param {sntls.Path} eventPath
             * @param {function} handler
             * @return {function}
             * @see evan.EventSpace#subscribeToUntilTriggered
             */
            subscribeToUntilTriggered: function (eventName, eventPath, handler) {
                return this.eventSpace.subscribeToUntilTriggered(eventName, eventPath, handler);
            },

            /**
             * Event delegation proxy.
             * @param {string} eventName
             * @param {sntls.Path} capturePath
             * @param {sntls.Path} delegatePath
             * @param {function} handler
             * @return {function}
             */
            delegateSubscriptionTo: function (eventName, capturePath, delegatePath, handler) {
                return this.eventSpace.delegateSubscriptionTo(eventName, capturePath, delegatePath, handler);
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
   "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * Reinterprets hash as an evented tree.
         * @returns {flock.EventedTree}
         */
        toEventedTree: function () {
            return flock.EventedTree.create(this.items);
        }
    });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isEventedTree: function (expr) {
            return flock.EventedTree.isBaseOf(expr);
        },

        isEventedTreeOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   flock.EventedTree.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates a new EventedTree instance based on the current array.
             * @returns {flock.EventedTree}
             */
            toEventedTree: function () {
                return flock.EventedTree.create(this);
            }
        },
        false, false, false
    );
}());
