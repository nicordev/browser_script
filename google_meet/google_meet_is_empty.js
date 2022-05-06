(function () {
    function isEmptyMeeting() {
        const element = document.querySelector('[role=status]');

        if (!element) {
            throw 'missing role element';
        }

        return element.textContent === 'No one else is here';
    }

    function warnWhenThereIsSomeoneInTheMeeting(delayInMilliseconds) {
        const intervalKey = setInterval(() => {
            try {
                if (isEmptyMeeting()) {
                    console.log('meeting is empty.');

                    return;
                }
            } catch (error) {
                console.log('not in the waiting room');
                clearInterval(intervalKey);

                return;
            }

            clearInterval(intervalKey);
            const title = 'Someone is here!';
            console.log(title);
            new Notification(title, options);
        }, delayInMilliseconds);
    }

    warnWhenThereIsSomeoneInTheMeeting(3000);
})();
