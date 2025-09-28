let isLogin = true;

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const switchText = document.getElementById('switchText');
const switchLink = document.getElementById('switchLink');
const authForm = document.getElementById('authForm');

switchLink.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (isLogin) {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        switchText.textContent = 'Already have an account?';
        switchLink.textContent = 'Login';
        isLogin = false;
    } else {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        switchText.textContent = "Don't have an account?";
        switchLink.textContent = 'Sign up';
        isLogin = true;
    }
});

authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (isLogin) {
        alert('Login attempted for: ' + username);
    } else {
        alert('Signup attempted for: ' + username);
    }
});