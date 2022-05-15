// ==UserScript==
// @name         My awesome script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  heaven on earth
// @author       Me
// @match        https://whatever-we-want.com/*
// @grant        none
// ==/UserScript==

(function () {
    const CSS_OVERLAY = 'myAwesomeOverlay';
    const CSS_HEADER = CSS_OVERLAY + '-header';
    const CSS_HEADER_TITLE = CSS_HEADER + '-title';
    const CSS_OVERLAY_COMMAND = CSS_OVERLAY + '-command';
    const CSS_OVERLAY_COMMAND_BUTTON = CSS_OVERLAY_COMMAND + '-button';
    const CSS_OVERLAY_COMMAND_DRAG = CSS_OVERLAY_COMMAND + '-drag';
    const CSS_OVERLAY_COMMAND_MINIMIZE = CSS_OVERLAY_COMMAND + '-size';
    const CSS_OVERLAY_COMMAND_CLOSE = CSS_OVERLAY_COMMAND + '-close';

    addCss(document.body, `
.${CSS_OVERLAY} {
    background-color: #e8eaed;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
    padding: 1em;
    top: 4px;
    left: 4px;
    z-index: 99999;
    font-size: 0.85em;
    cursor: move;
}

.${CSS_HEADER} {
    padding-right: 4em;
}

.${CSS_HEADER_TITLE} {
    font-size: 1.5em;
    padding: 0.5em;
}

.${CSS_OVERLAY_COMMAND} {
    position: absolute;
    top: .5em;
    right: .5em;
    text-align: center;
    font-weight: bold;
    font-family: Arial;
}

.${CSS_OVERLAY_COMMAND_BUTTON} {
    border: none;
    border-radius: 1em;
    padding: .5em 1em;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
    background-color: #00796b;
    cursor: pointer;
}

.${CSS_OVERLAY_COMMAND_DRAG} {
    padding: .1em;
    margin-left: .4em;
    width: 1.1em;
    display: inline-block;
}

.${CSS_OVERLAY_COMMAND_MINIMIZE} {
    background-color: rgb(218 183 103);
}

.${CSS_OVERLAY_COMMAND_CLOSE} {
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

    function createOverlay(options = {}) {
        const overlayElement = document.createElement('div');
        overlayElement.classList.add(CSS_OVERLAY);

        const windowButtonsElement = createWindowButtons(overlayElement);
        const headerElement = createHeader(options.title ?? 'hello');
        headerElement.appendChild(windowButtonsElement);
        overlayElement.appendChild(headerElement);

        const contentElement = createContentElement(options.elements ?? []);
        overlayElement.appendChild(contentElement);

        return overlayElement;
    }

    function createHeader(title) {
        const titleElement = document.createElement('div');
        titleElement.classList.add(CSS_HEADER_TITLE);
        titleElement.textContent = title;

        const headerElement = document.createElement('div');
        headerElement.classList.add(CSS_HEADER);
        headerElement.appendChild(titleElement);

        return headerElement;
    }

    function createWindowButtons(draggableElement) {
        const buttonsWrapperElement = document.createElement('span');
        const closeButtonElement = document.createElement('span');
        const minimizeButtonElement = document.createElement('span');
        const dragHandleButtonElement = document.createElement('span');

        buttonsWrapperElement.classList.add(CSS_OVERLAY_COMMAND);

        minimizeButtonElement.textContent = '-';
        minimizeButtonElement.classList.add(CSS_OVERLAY_COMMAND_MINIMIZE, CSS_OVERLAY_COMMAND_DRAG, CSS_OVERLAY_COMMAND_BUTTON);

        setToggleSizeButtonElementInteractions(minimizeButtonElement);

        closeButtonElement.textContent = 'x';
        closeButtonElement.classList.add(CSS_OVERLAY_COMMAND_CLOSE, CSS_OVERLAY_COMMAND_DRAG, CSS_OVERLAY_COMMAND_BUTTON);

        setCloseButtonInteractions(closeButtonElement);

        dragHandleButtonElement.textContent = '#';
        dragHandleButtonElement.classList.add('drag-handle-button', CSS_OVERLAY_COMMAND_DRAG, CSS_OVERLAY_COMMAND_BUTTON);
        setDraggableElement(draggableElement, dragHandleButtonElement);

        buttonsWrapperElement.appendChild(dragHandleButtonElement);
        buttonsWrapperElement.appendChild(minimizeButtonElement);
        buttonsWrapperElement.appendChild(closeButtonElement);

        return buttonsWrapperElement;
    }

    function setToggleSizeButtonElementInteractions(minimizeButtonElement) {
        minimizeButtonElement.addEventListener('mouseup', function (event) {
            const overlayElement = this.closest(`.${CSS_OVERLAY}`);
            const mainElement = overlayElement.getElementsByClassName(CSS_OVERLAY + '-content')[ 0 ];

            switch (minimizeButtonElement.textContent) {
                case '-':
                    mainElement.style.display = 'none';
                    minimizeButtonElement.textContent = '+';
                    break;
                case '+':
                    mainElement.style.display = 'initial';
                    minimizeButtonElement.textContent = '-';
                    break;
            }
        });
    }

    function setCloseButtonInteractions(closeButtonElement) {
        closeButtonElement.addEventListener('mouseup', function (event) {
            this.closest(`.${CSS_OVERLAY}`).remove();
        });
    }

    function createContentElement(contentElements) {
        const contentElement = document.createElement('span');
        contentElement.classList.add(CSS_OVERLAY + '-content');

        contentElements.forEach(element => {
            contentElement.appendChild(element);
        });

        return contentElement;
    }

    function main(options) {
        const overlayElement = createOverlay(options);
        document.body.appendChild(overlayElement);
    }

    /**
     * Put the magic...
     */
    function createMyElements() {
        // here...
        const resultElement = document.createElement('div');
        const actionButtonElement = document.createElement('button');
        actionButtonElement.textContent = 'ok';
        actionButtonElement.addEventListener('click', function (event) {
            // and here...
            console.log('hello world!');
            resultElement.textContent = 'hello world!';
        });

        return [
            resultElement,
            actionButtonElement,
        ]
    }

    main({
        title: 'hello world',
        elements: createMyElements(),
    });
})();