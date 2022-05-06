(function () {
  function isElementVisible(element) {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  }

  async function waitForElementToShow(element) {
    while (false === isElementVisible(element)) {
      console.log('waiting...');
    }

    return true;
  }

  async function clickOk() {
    const okElement = document.body.querySelector('#button_confirm_ok');

    if (await waitForElementToShow(okElement)) {
      okElement.click();
    }
  }

  function closeElements(namesToClose) {
    const crossElements = [ ...document.querySelectorAll('i[title=Close]') ];

    crossElements.map((crossElement) => {
      const namesToClose = [
        'Query'
      ];
      const name = crossElement.parentNode.textContent;

      if (false === namesToClose.includes(name)) {
        return;
      }

      const contextElement = crossElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

      if (isElementVisible(contextElement)) {
        crossElement.click();
        clickOk();
      }
    });
  }

  closeElements([
    'Query'
  ]);
})()