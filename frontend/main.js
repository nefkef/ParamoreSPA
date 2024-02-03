document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav a');
    const contentSections = document.querySelectorAll('.content-section');
  
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
  
        const targetId = link.getAttribute('href').substring(1);
  
        contentSections.forEach(function (section) {
          if (section.id === targetId) {
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
          }
        });
  
        updateAsideMenu(targetId);
      });
    });
  
    const loginForm = document.getElementById('login-form');
  
    const username = "your_username";
    const password = "your_password";
  
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const usernameInput = document.getElementById('username').value;
      const passwordInput = document.getElementById('password').value;
  
      if (usernameInput === username && passwordInput === password) {
        alert('Successful login!');
        // Perform actions after successful login
      } else {
        alert('Invalid credentials. Please check your username and password.');
        // Perform actions for invalid credentials
      }
    });

    disconnectButton.addEventListener('click', function (event) {
    event.preventDefault();
    updateButtonVisibility(false);
    });

  });

  var elements = document.getElementsByClassName("column");
  var i;
  // Two images side by side
  function one() {
    for (i = 0; i < elements.length; i++) {
      elements[i].style.msFlex = "100%";  // IE10
      elements[i].style.flex = "100%";
    }
  }

  
  function updateAsideMenu(section) {
    document.querySelectorAll('aside > div').forEach(div => {
      div.style.display = div.id === section ? 'block' : 'none';
    });
  }
  