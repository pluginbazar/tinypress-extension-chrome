/**
 * Handle Options JS
 *
 * @copyright Pluginbazar
 */

(function ($, window, document) {
    "use strict";

    let tinypress_options = ['tinypress_web_address', 'tinypress_auth_key'];


    $(window).on('load', function () {
        chrome.storage.sync.get(["TinyPress"], function (items) {
            $.each(items.TinyPress, function (key, value) {
                let option_field = $('#' + key);
                if (option_field.length > 0) {
                    option_field.val(value);
                }
            });
        });
    });


    $(document).on('submit', '.settings-form', function (e) {

        e.preventDefault();

        let el_notice = $('.settings-notice'), option_values = [];

        tinypress_options.forEach(function (option_key) {
            option_values[option_key] = $('#' + option_key).val();
        });

        option_values = $.extend({}, option_values);

        chrome.storage.sync.set({"TinyPress": option_values}, function () {
            console.log('saved');
        });

        el_notice.fadeIn();

        return false;
    });


})(jQuery, window, document);