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

            return match[1] || null;
        }

        return names
            .filter((currentValue, currentIndex, elements) => {
                return currentIndex === elements.indexOf(currentValue);
            })
            .sort();
    }

    function setDraggableElement(element) {
        let isDown = false;
        let offset = [0,0];

        if (!['absolute', 'relative'].includes(element.style.position)) {
            element.style.position = 'absolute';
        }

        element.addEventListener('mousedown', function (event) {
            if (event.button === 0) {
                isDown=true;
                offset = [
                    element.offsetLeft - event.clientX,
                    element.offsetTop - event.clientY
                ];
            }
        });
        document.addEventListener('mouseup', function (event) {
            isDown=false;
        });
        document.addEventListener('mousemove', function (event) {
            event.preventDefault();
            if (isDown) {
                element.style.left = (event.clientX + offset[0]) + 'px';
                element.style.top = (event.clientY + offset[1]) + 'px';
            }
        });
    }

    function createOverlay() {
        const element = document.createElement('div');

        element.classList.add('whoHasTalkedNameList');
        element.style.backgroundColor = '#e8eaed';
        element.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        element.style.padding = '1em';
        element.style.top = '4px';
        element.style.left = '4px';
        element.style.zIndex = '999';
        element.style.fontSize = '.85em';
        element.style.borderRadius = '.85em';
        element.style.cursor = 'move';

        setDraggableElement(element);

        return element;
    }

    function createHeader() {
        const headerElement = document.createElement('div');
        const titleElement = document.createElement('div');

        headerElement.style.paddingRight='4em';

        titleElement.textContent = 'Who has talked?';
        titleElement.style.fontSize = '1.5em';
        titleElement.style.padding = '0.5em';

        headerElement.appendChild(titleElement);

        return headerElement;
    }

    function createWindowButtons() {
        const buttonsWrapperElement = document.createElement('span');
        const closeButtonElement = document.createElement('span');
        const toggleSizeButtonElement = document.createElement('span');

        buttonsWrapperElement.style.position= 'absolute';
        buttonsWrapperElement.style.top= '.5em';
        buttonsWrapperElement.style.right='.5em';
        buttonsWrapperElement.style.textAlign='center';
        buttonsWrapperElement.style.fontWeight='bold';
        buttonsWrapperElement.style.fontFamily='Arial';

        toggleSizeButtonElement.textContent= '-';
        toggleSizeButtonElement.style.cursor='pointer';
        toggleSizeButtonElement.style.padding='.1em';
        toggleSizeButtonElement.style.marginLeft='.4em';
        toggleSizeButtonElement.style.border='none';
        toggleSizeButtonElement.style.borderRadius='1em';
        toggleSizeButtonElement.style.backgroundColor='rgb(218 183 103)';
        toggleSizeButtonElement.style.boxShadow='0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        toggleSizeButtonElement.style.width='1.1em';
        toggleSizeButtonElement.style.display= 'inline-block';

        setToggleSizeButtonElementInteractions(toggleSizeButtonElement);

        closeButtonElement.textContent= 'x';
        closeButtonElement.style.cursor='pointer';
        closeButtonElement.style.padding='.1em';
        closeButtonElement.style.marginLeft='.4em';
        closeButtonElement.style.border='none';
        closeButtonElement.style.borderRadius='1em';
        closeButtonElement.style.backgroundColor='#c55a5a';
        closeButtonElement.style.boxShadow='0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        closeButtonElement.style.width='1.1em';
        closeButtonElement.style.display= 'inline-block';

        setCloseButtonInteractions(closeButtonElement);

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

        refreshNameListButtonElement.textContent = 'Refresh list';
        refreshNameListButtonElement.style.border = 'none';
        refreshNameListButtonElement.style.borderRadius = '1em';
        refreshNameListButtonElement.style.padding = '.5em 1em';
        refreshNameListButtonElement.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        refreshNameListButtonElement.style.backgroundColor = '#00796b';
        refreshNameListButtonElement.style.color = '#fff';
        refreshNameListButtonElement.style.fontWeight = 'bold';
        refreshNameListButtonElement.style.cursor='pointer';

        return refreshNameListButtonElement;
    }

    function displayNameList() {
        const overlayElement = createOverlay();
        const headerElement = createHeader();
        const windowButtonsElement = createWindowButtons();
        const helpElement = createHelpElement();
        const refreshNameListButtonElement = createRefreshNameListButton();
        const contentElement = document.createElement('span');

        // Main
        contentElement.classList.add('whoHasTalkedMain');

        headerElement.appendChild(windowButtonsElement);
        contentElement.appendChild(helpElement);
        contentElement.appendChild(refreshNameListButtonElement);
        overlayElement.appendChild(headerElement);
        overlayElement.appendChild(contentElement);

        // Name list
        const nameListElement = document.createElement('ul');
        nameListElement.style.paddingInlineStart= '1em';

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
        toggleSizeButtonElement.addEventListener('mouseup', function(event){
            var overlayElement = this.closest('.whoHasTalkedNameList');
            var mainElement = overlayElement.getElementsByClassName('whoHasTalkedMain')[0];
            switch(toggleSizeButtonElement.textContent) {
                case '-':
                    mainElement.style.display='none';
                    overlayElement.style.padding='0';
                    toggleSizeButtonElement.textContent='+';
                    break;
                case '+':
                    mainElement.style.display='initial';
                    overlayElement.style.padding='1em';
                    toggleSizeButtonElement.textContent='-';
                    break;
            }
        });
    }

    function setCloseButtonInteractions(closeButtonElement) {
        closeButtonElement.addEventListener('mouseup', function(event){
            this.closest('.whoHasTalkedNameList').remove();
        });
    }

    function isNameAlreadyDisplayed(nameListElement, name) {
        return [...nameListElement].filter(nameElement => (nameElement.textContent === name)).length > 0;
    }

    function refreshNameList(nameListElement, names) {
        names.map(function (name) {
            if (!isNameAlreadyDisplayed(nameListElement.children, name)) {
                nameListElement.appendChild(createNameElement(name));
            }
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
        nameElement.addEventListener('dblclick', function () {
            this.remove();
        });

        return nameElement;
    }
})();