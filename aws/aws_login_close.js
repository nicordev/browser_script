// ==UserScript==
// @name         AWS Login auto close on success
// @match        https://*/start/user-consent/login-success.html
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementsByClassName('awsui-icon-variant-success').length > 0) {
        window.close();
    }
})();