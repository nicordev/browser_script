(function () {
    'use strict';

    function isAppropriateUrl(url) {
        const urlParameters = new URLSearchParams(window.location.search);
        const redirectUri = urlParameters.get('redirect_uri');

        return redirectUri.includes(url);
    }

    function selectAccount(email) {
        const accountElement = document.body.querySelector(`*[data-email="${email}"]`);

        if (!accountElement) {
            console.log(`account ${email} not found.`);
        }

        accountElement.click();
    }

    if (!isAppropriateUrl('myUrlHere')) {
        return;
    }

    setTimeout(() => selectAccount("myEmailHere"), 3000);
})();
