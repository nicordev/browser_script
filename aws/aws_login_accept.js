// ==UserScript==
// @name         AWS Login auto accept
// @match        https://*/start/user-consent/authorize.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('cli_login_button').click();
})();