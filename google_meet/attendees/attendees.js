(function () {
    const STORAGE_KEY_ATTENDEES = 'daily-meet';
    const STORAGE_KEY_EXPECTED_ATTENDEES = 'daily-meet-expected-names';

    function Attendee(name) {
        this.name = name;
        this.hasTalked = false;
        return this;
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

    function createAttendeesFromNames(names) {
        return names.map((name) => new Attendee(name));
    }

    function getCurrentAttendees() {
        return createAttendeesFromNames(fetchVisibleNames());
    }

    function saveAttendeesToSession(attendees) {
        sessionStorage.setItem(
            STORAGE_KEY_ATTENDEES,
            JSON.stringify(attendees)
        );
    }

    function getAttendeesFromSession() {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY_ATTENDEES));
    }

    function saveExpectedAttendeesToLocalStorage() {
        sessionStorage.setItem(
            STORAGE_KEY_EXPECTED_ATTENDEES,
            JSON.stringify([
                'serge',
                'kévin',
                'yann',
                'christophe',
                'xavier',
                'sébastien',
                'thomas',
                'gabriel',
                'jérémie',
            ])
        );
    }

    function getExpectedAttendeesFromLocalStorage() {
        return sessionStorage.getItem(STORAGE_KEY_EXPECTED_ATTENDEES);
    }

    saveExpectedAttendeesToLocalStorage();
    console.log(getExpectedAttendeesFromLocalStorage());
})();
