(() => {
  const clickCopyLasWeekLink = (
  ) => {
  
    let links = document.getElementsByTagName('a');
  	let linkRegex = /Copy last week/;
  
    for (let link of links) {
      if (linkRegex.test(link.innerHTML)) {
        link.click();
        return;
      }
    }
	}
  
  const fillInputs = () => {
    let inputs = document.getElementsByClassName('cl-timesheet-input');
    
    for (let i = 0; i < 4; i++) {
      inputs[i].value = '7:00';
    }
  }
  
  clickCopyLasWeekLink();
  setTimeout(fillInputs, 200);
})();
