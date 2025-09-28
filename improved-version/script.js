class AuthManager {
    constructor() {
        this.isLogin = true;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.initializeElements();
        this.attachEventListeners();
        this.animateInputs();
    }

    initializeElements() {
        this.formTitle = document.getElementById('formTitle');
        this.formSubtitle = document.getElementById('formSubtitle');
        this.submitBtn = document.getElementById('submitBtn');
        this.switchText = document.getElementById('switchText');
        this.switchLink = document.getElementById('switchLink');
        this.authForm = document.getElementById('authForm');
        this.emailGroup = document.getElementById('emailGroup');
        this.loginOptions = document.getElementById('loginOptions');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
    }

    attachEventListeners() {
        this.switchLink.addEventListener('click', (e) => this.handleFormSwitch(e));
        this.authForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
        
        // Real-time validation
        document.getElementById('email').addEventListener('input', () => this.validateEmail());
        document.getElementById('username').addEventListener('input', () => this.validateUsername());
        document.getElementById('password').addEventListener('input', () => this.validatePassword());
    }

    animateInputs() {
        const inputs = document.querySelectorAll('.input-group');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleFormSwitch(e) {
        e.preventDefault();
        
        const card = document.querySelector('.auth-card');
        card.classList.add('form-switching');
        
        setTimeout(() => {
            if (this.isLogin) {
                this.switchToSignup();
            } else {
                this.switchToLogin();
            }
            
            card.classList.remove('form-switching');
            card.classList.add('form-switched');
            
            setTimeout(() => {
                card.classList.remove('form-switched');
            }, 300);
        }, 150);
    }

    switchToSignup() {
        this.formTitle.textContent = 'Create Account';
        this.formSubtitle.textContent = 'Join us today';
        this.submitBtn.innerHTML = '<span>Sign Up</span><i class="fas fa-user-plus"></i>';
        this.switchText.textContent = 'Already have an account?';
        this.switchLink.textContent = 'Sign in';
        this.emailGroup.style.display = 'block';
        this.loginOptions.style.display = 'none';
        this.isLogin = false;
        this.clearErrors();
    }

    switchToLogin() {
        this.formTitle.textContent = 'Welcome Back';
        this.formSubtitle.textContent = 'Sign in to your account';
        this.submitBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        this.switchText.textContent = "Don't have an account?";
        this.switchLink.textContent = 'Sign up';
        this.emailGroup.style.display = 'none';
        this.loginOptions.style.display = 'flex';
        this.isLogin = true;
        this.clearErrors();
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.passwordToggle.classList.toggle('fa-eye');
        this.passwordToggle.classList.toggle('fa-eye-slash');
    }

    validateEmail() {
        const email = document.getElementById('email').value;
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showError(emailError, 'Please enter a valid email address');
            return false;
        } else {
            this.hideError(emailError);
            return true;
        }
    }

    validateUsername() {
        const username = document.getElementById('username').value;
        const usernameError = document.getElementById('usernameError');
        
        if (username && username.length < 3) {
            this.showError(usernameError, 'Username must be at least 3 characters');
            return false;
        } else {
            this.hideError(usernameError);
            return true;
        }
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const passwordError = document.getElementById('passwordError');
        
        if (password && password.length < 6) {
            this.showError(passwordError, 'Password must be at least 6 characters');
            return false;
        } else if (password && !this.isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            this.showError(passwordError, 'Password must contain uppercase, lowercase, and number');
            return false;
        } else {
            this.hideError(passwordError);
            return true;
        }
    }

    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }

    hideError(element) {
        element.classList.remove('show');
    }

    clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => this.hideError(error));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        
        // Validate all fields
        let isValid = true;
        
        if (!this.isLogin && !this.validateEmail()) isValid = false;
        if (!this.validateUsername()) isValid = false;
        if (!this.validatePassword()) isValid = false;
        
        if (!username) {
            this.showError(document.getElementById('usernameError'), 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            this.showError(document.getElementById('passwordError'), 'Password is required');
            isValid = false;
        }
        
        if (!this.isLogin && !email) {
            this.showError(document.getElementById('emailError'), 'Email is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        if (this.isLogin) {
            this.handleLogin(username, password);
        } else {
            this.handleSignup(username, password, email);
        }
    }

    handleLogin(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }
            
            this.showSuccess('Login successful! Welcome back, ' + username);
            
            // Simulate redirect after success
            setTimeout(() => {
                alert('Redirecting to dashboard...');
            }, 1500);
        } else {
            this.showError(document.getElementById('usernameError'), 'Invalid username or password');
        }
    }

    handleSignup(username, password, email) {
        const existingUser = this.users.find(u => u.username === username || u.email === email);
        
        if (existingUser) {
            if (existingUser.username === username) {
                this.showError(document.getElementById('usernameError'), 'Username already exists');
            } else {
                this.showError(document.getElementById('emailError'), 'Email already registered');
            }
            return;
        }
        
        const newUser = { username, password, email, createdAt: new Date().toISOString() };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.showSuccess('Account created successfully! You can now sign in.');
        
        // Auto switch to login after successful signup
        setTimeout(() => {
            this.switchToLogin();
            document.getElementById('username').value = username;
        }, 1500);
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            animation: slideInRight 0.5s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 500);
        }, 3000);
    }
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});