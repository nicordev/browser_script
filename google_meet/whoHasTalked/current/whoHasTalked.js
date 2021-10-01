// ==UserScript==
// @name         Who has talked?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show a list of attendees to see who has already talked. Click on a name to remove it. Double click on the list to remove the overlay.
// @author       You
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    makeNameList();

    addCss(document.body, `
.name-form {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0.5em;
}

.name-form textarea {
    border-radius: 0.5em;
    padding: 0.5em;
    margin: 0.5em 0;
}

.name-list-item {
    margin: 0.5em;
    cursor: pointer;
}

.name-list-item:hover {
    background-color: aquamarine;
    font-weight: bold;
}

.has-talked {
    color: grey;
    text-decoration: line-through;
}

.button-wrapper {
    position: absolute;
    top: .5em;
    right: .5em;
    text-align: center;
    font-weight: bold;
    font-family: Arial;
}

.button {
    border: none;
    border-radius: 1em;
    padding: .5em 1em;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
    background-color: #00796b;
    cursor: pointer;
}

.refresh-button {
    border: none;
    border-radius: 1em;
    padding: .5em 1em;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
    background-color: #00796b;
    color: #fff;
    cursor: pointer;
}

.window-button {
    padding: .1em;
    margin-left: .4em;
    width: 1.1em;
    display: inline-block;
}

.size-button {
    background-color: rgb(218 183 103);
}

.close-button {
    background-color: #c55a5a;
}
    `);

    function addCss(element, css) {
        const styleElement = document.createElement('style');

        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = css;
        } else {
            styleElement.appendChild(document.createTextNode(css));
        }

        element.appendChild(styleElement);
    }

    /**
     * Fetch names from the main window
     */
    function fetchVisibleNames() {
        const elements = document.querySelectorAll('div[data-self-name]');
        let names = [];

        for (let element of elements) {
            names.push(element.textContent);
        }

        return names
            .filter((currentValue, currentIndex, elements) => {
                return currentIndex === elements.indexOf(currentValue);
            })
            .sort();
    }

    /**
     * Fetch names from the name list
     */
    function fetchNamesFromUserList() {
        const nameElements = [
            ...document.querySelectorAll('div[aria-label]'),
        ];
        const names = nameElements.map(fetchName).filter((name) => name);

        function fetchName(nameElement) {
            let attributeValue = nameElement.getAttribute('aria-label');
            let match =
                attributeValue.match(
                    '^Afficher d\'autres actions pour (.+)$'
                ) || [];

            return match[ 1 ] || null;
        }

        return names
            .filter((currentValue, currentIndex, elements) => {
                return currentIndex === elements.indexOf(currentValue);
            })
            .sort();
    }

    function setDraggableElement(element, handleElement) {
        let isDown = false;
        let offset = [ 0, 0 ];

        if (![ 'absolute', 'relative' ].includes(element.style.position)) {
            element.style.position = 'absolute';
        }

        handleElement.addEventListener('mousedown', function (event) {
            if (event.button === 0) {
                isDown = true;
                offset = [
                    element.offsetLeft - event.clientX,
                    element.offsetTop - event.clientY
                ];
            }
        });
        document.addEventListener('mouseup', function (event) {
            isDown = false;
        });
        document.addEventListener('mousemove', function (event) {
            event.preventDefault();
            if (isDown) {
                element.style.left = (event.clientX + offset[ 0 ]) + 'px';
                element.style.top = (event.clientY + offset[ 1 ]) + 'px';
            }
        });
    }

    function createOverlay() {
        const overlayElement = document.createElement('div');

        overlayElement.classList.add('whoHasTalkedNameList');
        overlayElement.style.backgroundColor = '#e8eaed';
        overlayElement.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        overlayElement.style.padding = '1em';
        overlayElement.style.top = '4px';
        overlayElement.style.left = '4px';
        overlayElement.style.zIndex = '999';
        overlayElement.style.fontSize = '.85em';
        overlayElement.style.borderRadius = '.85em';
        overlayElement.style.cursor = 'move';

        return overlayElement;
    }

    function createHeader() {
        const headerElement = document.createElement('div');
        const titleElement = document.createElement('div');

        headerElement.style.paddingRight = '4em';

        titleElement.textContent = 'Who has talked?';
        titleElement.style.fontSize = '1.5em';
        titleElement.style.padding = '0.5em';

        headerElement.appendChild(titleElement);

        return headerElement;
    }

    function createWindowButtons(draggableElement) {
        const buttonsWrapperElement = document.createElement('span');
        const closeButtonElement = document.createElement('span');
        const toggleSizeButtonElement = document.createElement('span');
        const dragHandleButtonElement = document.createElement('span');

        buttonsWrapperElement.classList.add('button-wrapper');

        toggleSizeButtonElement.textContent = '-';
        toggleSizeButtonElement.classList.add('size-button', 'window-button', 'button');

        setToggleSizeButtonElementInteractions(toggleSizeButtonElement);

        closeButtonElement.textContent = 'x';
        closeButtonElement.classList.add('close-button', 'window-button', 'button');

        setCloseButtonInteractions(closeButtonElement);

        dragHandleButtonElement.textContent = '#';
        dragHandleButtonElement.classList.add('drag-handle-button', 'window-button', 'button');
        setDraggableElement(draggableElement, dragHandleButtonElement);

        buttonsWrapperElement.appendChild(dragHandleButtonElement);
        buttonsWrapperElement.appendChild(toggleSizeButtonElement);
        buttonsWrapperElement.appendChild(closeButtonElement);

        return buttonsWrapperElement;
    }

    function createHelpElement() {
        const helpElement = document.createElement('div');

        helpElement.textContent = 'Click on a name to remove it from the list.';
        helpElement.style.fontSize = '0.75em';
        helpElement.style.padding = '0.5em';
        helpElement.style.color = '#3c4043';

        return helpElement;
    }

    function createRefreshNameListButton() {
        const refreshNameListButtonElement = document.createElement('button');

        refreshNameListButtonElement.classList.add('refresh-button', 'button');
        refreshNameListButtonElement.textContent = 'Refresh list';

        return refreshNameListButtonElement;
    }

    function createNameInput(nameListElement) {
        const nameFormElement = document.createElement('form');
        const nameInputElement = document.createElement('textarea');
        const appendButtonElement = document.createElement('button');

        appendButtonElement.type = 'submit';
        appendButtonElement.textContent = 'add names';
        appendButtonElement.classList.add('button', 'refresh-button');
        nameInputElement.placeholder = 'new names';

        nameFormElement.classList.add('name-form');
        nameFormElement.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!nameInputElement.value) {
                return;
            }

            const names = nameInputElement.value.split('\n');

            names.forEach(name => appendNameToList(nameListElement, name));
        });

        nameFormElement.appendChild(nameInputElement);
        nameFormElement.appendChild(appendButtonElement);

        return nameFormElement;
    }

    function createNameListElement() {
        const nameListElement = document.createElement('ul');

        nameListElement.style.paddingInlineStart = '1em';
        nameListElement.classList.add('name-list');

        return nameListElement;
    }

    function makeNameList() {
        const overlayElement = createOverlay();
        const headerElement = createHeader();
        const windowButtonsElement = createWindowButtons(overlayElement);
        const helpElement = createHelpElement();
        const refreshNameListButtonElement = createRefreshNameListButton();
        const contentElement = document.createElement('span');
        const nameListElement = createNameListElement();

        // Main
        contentElement.classList.add('who-has-talked-content');

        headerElement.appendChild(windowButtonsElement);
        contentElement.appendChild(helpElement);
        contentElement.appendChild(refreshNameListButtonElement);
        contentElement.appendChild(createNameInput(nameListElement));
        overlayElement.appendChild(headerElement);
        overlayElement.appendChild(contentElement);

        // Name list
        contentElement.appendChild(nameListElement);

        refreshNameListButtonElement.addEventListener('click', function () {
            let names = fetchNamesFromUserList();

            if (0 === names.length) {
                console.log(
                    'Fetching names from main window. Open user panel to get the full list of participants.'
                );
                names = fetchVisibleNames();
            }

            console.log(names.join('\n'));
            refreshNameList(nameListElement, names);
        });

        document.body.appendChild(overlayElement);
    }

    function setToggleSizeButtonElementInteractions(toggleSizeButtonElement) {
        toggleSizeButtonElement.addEventListener('mouseup', function (event) {
            var overlayElement = this.closest('.whoHasTalkedNameList');
            var mainElement = overlayElement.getElementsByClassName('who-has-talked-content')[ 0 ];
            switch (toggleSizeButtonElement.textContent) {
                case '-':
                    mainElement.style.display = 'none';
                    overlayElement.style.padding = '0';
                    toggleSizeButtonElement.textContent = '+';
                    break;
                case '+':
                    mainElement.style.display = 'initial';
                    overlayElement.style.padding = '1em';
                    toggleSizeButtonElement.textContent = '-';
                    break;
            }
        });
    }

    function setCloseButtonInteractions(closeButtonElement) {
        closeButtonElement.addEventListener('mouseup', function (event) {
            this.closest('.whoHasTalkedNameList').remove();
        });
    }

    function isNameAlreadyDisplayed(nameListElement, name) {
        return [ ...nameListElement ].filter(nameElement => (nameElement.textContent === name)).length > 0;
    }

    function appendNameToList(nameListElement, name) {
        let nameElement = createNameElement(name);

        nameListElement.appendChild(nameElement);
    }

    function refreshNameList(nameListElement, names) {
        names.map(function (name) {
            if (!isNameAlreadyDisplayed(nameListElement.children, name)) {
                appendNameToList(nameListElement, name);
            }
        });
    }

    function createNameElement(name) {
        const nameElement = document.createElement('li');

        nameElement.classList.add('name-list-item');
        nameElement.textContent = name;

        nameElement.addEventListener('click', function () {
            if (this.classList.contains('has-talked')) {
                this.classList.remove('has-talked');

                return;
            }
            this.classList.add('has-talked');
        });
        nameElement.addEventListener('dblclick', function () {
            this.remove();
        });

        return nameElement;
    }
})();