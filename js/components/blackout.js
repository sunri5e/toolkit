/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './component',
    '../flags/vendor'
], function($, Toolkit, vendor) {

/** Has the blackout been created already? */
var blackout = null;

Toolkit.Blackout = Toolkit.Component.extend({
    name: 'Blackout',
    version: '2.0.0',

    /** How many times the blackout has been opened while being opened. */
    count: 0,

    /** The loader animation element. */
    loader: null,

    /** The message element. */
    message: null,

    /**
     * Create the blackout and loader elements.
     *
     * @param {Object} [options]
     */
    constructor: function(options) {
        this.options = options = this.setOptions(options);
        this.element = this.createElement();

        // Generate loader elements
        this.loader = $(options.loaderTemplate).appendTo(this.element);
        this.message = this.loader.find(this.ns('message', 'loader'));

        if (options.showLoading) {
            this.message.html(Toolkit.messages.loading);
        }

        // Initialize
        this.initialize();
    },

    /**
     * Remove the blackout element and reset instance.
     */
    destructor: function() {
        this.element.remove();
        blackout = null;
    },

    /**
     * Hide the blackout if count reaches 0.
     */
    hide: function() {
        this.fireEvent('hiding');

        var count = this.count - 1;

        if (count <= 0) {
            this.count = 0;
            this.element.conceal();
        } else {
            this.count = count;
        }

        this.hideLoader();

        this.fireEvent('hidden', [(count <= 0)]);
    },

    /**
     * Hide the loader.
     */
    hideLoader: function() {

        // There's an issue on Chrome where calling conceal() here doesn't work
        // when the blackout is being transitioned. So just change it's display.
        this.loader.hide();
    },

    /**
     * Show the blackout and increase open count.
     */
    show: function() {
        this.fireEvent('showing');

        var show = false;

        this.count++;

        if (this.count === 1) {
            this.element.reveal();
            show = true;
        }

        this.showLoader();

        this.fireEvent('shown', [show]);
    },

    /**
     * Show the loader.
     */
    showLoader: function() {

        // The same problem for hide() applies here, so just change the display.
        this.loader.show();
    }

}, {
    showLoading: true,
    template: '<div class="' + vendor + 'blackout"></div>',
    templateFrom: '#toolkit-blackout-1',
    loaderTemplate: '<div class="' + vendor + 'loader bar-wave">' +
        '<span></span><span></span><span></span><span></span><span></span>' +
        '<div class="' + vendor + 'loader-message" data-loader-message></div>' +
    '</div>'
});

/**
 * Only one instance of Blackout should exist,
 * so provide a factory method that stores the instance.
 *
 * @param {Object} [options]
 * @returns {Toolkit.Blackout}
 */
Toolkit.Blackout.instance = function(options) {
    if (blackout) {
        return blackout;
    }

    return blackout = new Toolkit.Blackout(options);
};

return Toolkit;
});