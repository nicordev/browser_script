(function () {
    displayNameList(fetchNames());

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

    function displayNameList(names) {
        const overlayElement = document.createElement('div');

        console.log(names.join('\n'));

        overlayElement.style.position = 'absolute';
        overlayElement.style.backgroundColor = '#48c774';
        overlayElement.style.padding = '1em';
        overlayElement.style.top = '0';
        overlayElement.style.left = '0';

        overlayElement.addEventListener('dblclick', function (event) {
            this.remove();
        });

        names.map(function (name) {
            overlayElement.appendChild(createNameElement(name));
        });

        document.body.appendChild(overlayElement);
    }

    function createNameElement(name) {
        const nameElement = document.createElement('div');

        nameElement.textContent = name;
        nameElement.addEventListener('click', function () {
            this.remove();
        });

        return nameElement;
    }
})();
