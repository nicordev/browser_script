(function () {
    displayNameList();

    /**
     * Fetch names from the main window
     */
    function fetchVisibleNames() {
        const elements = document.querySelectorAll('div[data-self-name]');
        let names = [];

        for (let element of elements) {
            names.push(element.textContent);
        }

        return names.filter((currentValue, currentIndex, elements) => {
            return currentIndex === elements.indexOf(currentValue);
        }).sort();
    }

    /**
     * Fetch names from the name list
     */
    function fetchNames() {
        const nameElements = elements = [...  document.querySelectorAll('div[data-sort-key]')];
        const names = nameElements.map(fetchName).filter(name => name);

        function fetchName(nameElement) {
            let attributeValue = nameElement.getAttribute('data-sort-key');
            let match = attributeValue.match('^(.+) spaces\/[a-zA-Z0-9]+\/devices\/[a-zA-Z0-9\-]+$') || [];

            return match[1] || null;
        }

        return names.sort();
    }

    function displayNameList() {
        const overlayElement = document.createElement('div');
        const headerElement = document.createElement('div');
        const titleElement = document.createElement('div');
        const helpElement = document.createElement('div');
        const refreshNameListButtonElement = document.createElement('button');

        // Overlay
        overlayElement.classList.add('whoHasTalkedNameList');
        overlayElement.style.position = 'absolute';
        overlayElement.style.backgroundColor = '#48c774';
        overlayElement.style.padding = '1em';
        overlayElement.style.top = '0';
        overlayElement.style.left = '0';
        overlayElement.style.zIndex = '999';

        overlayElement.addEventListener('dblclick', function (event) {
            this.remove();
        });

        // Header
        titleElement.textContent = 'Who has talked?';
        titleElement.style.fontSize = '1.5em';
        titleElement.style.padding = '0.5em';

        helpElement.textContent = 'Click on a name to remove it from the list.';
        helpElement.style.fontSize = '0.75em';
        helpElement.style.padding = '0.5em';
        helpElement.style.color = 'grey';

        refreshNameListButtonElement.textContent = 'Refresh list';

        headerElement.appendChild(titleElement);
        headerElement.appendChild(helpElement);
        headerElement.appendChild(refreshNameListButtonElement);
        overlayElement.appendChild(headerElement);

        // Name list
        const nameListElement = document.createElement('ul');

        overlayElement.appendChild(nameListElement);

        refreshNameListButtonElement.addEventListener('click', function () {
            const names = fetchNames();

            console.log(names.join('\n'));
            refreshNameList(nameListElement, names);
        });

        document.body.appendChild(overlayElement);
    }

    function refreshNameList(nameListElement, names) {
        nameListElement.innerHTML = '';
        names.map(function (name) {
            nameListElement.appendChild(createNameElement(name));
        });
    }

    function createNameElement(name) {
        const nameElement = document.createElement('li');

        nameElement.textContent = name;
        nameElement.style.margin = '0.5em';
        nameElement.style.cursor = 'pointer';
        nameElement.addEventListener('click', function () {
            if (this.classList.contains('has-talked')) {
                this.classList.remove('has-talked');
                this.style.color = 'black';
                this.style.textDecoration = 'none';
                return;
            }
            this.classList.add('has-talked');
            this.style.color = 'grey';
            this.style.textDecoration = 'line-through';
        });

        return nameElement;
    }
})();
