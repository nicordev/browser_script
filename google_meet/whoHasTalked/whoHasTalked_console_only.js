(function () {
    displayNameListInConsole(fetchNames());

    function fetchNames() {
        const elements = document.querySelectorAll('div[data-self-name]');
        let names = [];

        for (let element of elements) {
            names.push(element.textContent);
        }

        return names.filter((currentValue, currentIndex, elements) => {
            return (
                currentIndex === elements.indexOf(currentValue) &&
                currentValue !== 'Vous'
            );
        });
    }

    function displayNameListInConsole(names) {
        console.log(names.join('\n'));
    }
})();
