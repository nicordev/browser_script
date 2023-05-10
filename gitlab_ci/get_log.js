(function () {
    function getFeatureFiles() {
        const logLines = [
            ...document.querySelectorAll("div.js-line > span"),
        ].map((line) => line.textContent);
        const featureLines = logLines.filter((line) =>
            line.includes("# features")
        );

        return featureLines.map((line) => line.match(/(features.*)/)[1]);
    }

    setTimeout(function () {
        console.info(getFeatureFiles().join("\n"));
    }, 2000);
})();
