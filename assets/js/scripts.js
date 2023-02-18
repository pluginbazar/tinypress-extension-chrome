/**
 * Handle Popup JS
 *
 * @copyright Pluginbazar
 */


(function ($, window, document) {
    "use strict";

    $(window).on('load', function () {

        let active_tab_url, active_tab_title, tinypress_web_address, tinypress_auth_key;

        if (typeof chrome.tabs !== 'undefined') {

            chrome.tabs.query({active: true}, tabs => {
                let active_tab = tabs[0];
                active_tab_url = active_tab.url;
                active_tab_title = active_tab.title;
            });

            chrome.storage.sync.get(["TinyPress"], function (items) {
                $.each(items.TinyPress, function (key, value) {
                    if (key === 'tinypress_web_address') {
                        tinypress_web_address = value;
                    }

                    if (key === 'tinypress_auth_key') {
                        tinypress_auth_key = value;
                    }
                });
            });

            setTimeout(function () {
                let el_body = $('body'),
                    tinypress_wrap = el_body.find('.tinypress-wrap'),
                    tinypress_text = tinypress_wrap.find('.tinypress-text'),
                    tinypress_responses = el_body.find('.tinypress-responses');

                if (tinypress_web_address.charAt(tinypress_web_address.length - 1) === '/') {
                    tinypress_web_address = tinypress_web_address.slice(0, -1);
                }

                $.ajax({
                    url: tinypress_web_address + '/wp-json/tinypress/api/v1/create',
                    type: "post",
                    headers: [
                        {"Access-Control-Allow-Origin": "*"},
                        {"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}
                    ],
                    crossDomain: true,
                    data: {
                        'post_title': active_tab_title,
                        'target_url': active_tab_url,
                    },
                    success: function (data) {

                        if (data.success) {
                            // copy to clipboard
                            copy_to_clipboard(data.short_url);
                        }

                        // Updating url and message
                        tinypress_text.html(data.short_url);
                        tinypress_responses.html(data.message);

                        // Removing loading screen
                        el_body.removeClass('loading');
                        tinypress_wrap.fadeIn();
                        tinypress_responses.fadeIn();
                    }
                });

            }, 1000);
        }
    });

    function copy_to_clipboard(string) {

        let el_input = document.createElement('input');

        document.body.appendChild(el_input);
        el_input.value = string;
        el_input.select();
        document.execCommand('copy', false);
        el_input.remove();
    }

})(jQuery, window, document);