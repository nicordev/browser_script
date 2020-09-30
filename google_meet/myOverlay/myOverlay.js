/*
TODO:
-----

- display an overlay with a list of default names
- left click on a name: has talked
- right click on a name: is absent
- input to add a new name
*/

(function () {
    function listNames() {
        const nameElements = [
            ...document.querySelectorAll('div[data-sort-key]'),
        ];
        const names = nameElements.map(fetchName).filter((name) => name);

        function fetchName(nameElement) {
            let attributeValue = nameElement.getAttribute('data-sort-key');
            let match =
                attributeValue.match(
                    '^(.+) spaces/[a-zA-Z0-9]+/devices/[a-zA-Z0-9-]+$'
                ) || [];

            return match[1] || null;
        }

        return names.sort();
    }

    const names = [
        'coline',
        'sebastien',
        'serge',
        'xavier',
        'alexandre',
        'christophe',
        'kévin',
        'jérémie',
        'nicolas',
        'yann',
    ].sort();

    console.log(names);
})();
