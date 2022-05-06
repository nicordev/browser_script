(function () {
    // fetch code from my API
    function fetchCode() {
        return 755885;
    }

    // fill the input
    function fillInput(value) {
        document.querySelector('#idvPin').value = value;
    }

    fillInput(fetchCode());
})()