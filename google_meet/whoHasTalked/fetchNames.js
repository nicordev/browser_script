(function () {
    function fetchNamesFromElements() {
      const nameElements = [...document.querySelectorAll('[aria-label*="Afficher d\'autres actions pour"]')];    
      return [...new Set(nameElements.map((element) => element.getAttribute('aria-label').match('Afficher d\'autres actions pour (.+)')[1]))]
    }
    
    const names = fetchNamesFromElements()
      
    sessionStorage.setItem('google_meet_names', names)
    
    console.log(sessionStorage.getItem('google_meet_names'))
  })()
  