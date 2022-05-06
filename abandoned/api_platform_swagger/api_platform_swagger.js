(function () {
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjAwMDEiLCJpc3MiOiJCYXNoIEpXVCBHZW5lcmF0b3IiLCJpYXQiOjE1Njk5Mzc1MjUsImV4cCI6MjUyNDYwNDQwMH0.eyJjdXN0b21lciI6IkRFVl9MT0NBTCIsInVzZXJuYW1lIjoiREVWX0xPQ0FMIiwicm9sZXMiOiIiLCJpYXQiOiIxNTY5OTM3NTI1IiwiZXhwIjoiMjUyNDYwNDQwMCJ9.sdFEFk0inubUHC2MTLSI5MnHSHEZV5wSCZi9NGRks2M';
    
    document.querySelector('.authorize').click();
    
    setTimeout(handleAuthorizationForm, 200)
    
    function handleAuthorizationForm() {
      const authorizationFormElement = document.querySelector('form[_lpchecked]');
      console.log(authorizationFormElement)
  
      const authorizationFormInputElement = authorizationFormElement[0];
      const authorizationFormButtonElement = authorizationFormElement[1];
  
      authorizationFormInputElement.value = `Bearer ${token}`;
      authorizationFormButtonElement.click()
    }
  })()