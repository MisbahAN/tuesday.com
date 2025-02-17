import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                onLogin(data.user);
            } else {
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Network error or server down.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!username || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Only username and password
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                onLogin(data.user); // Log in the user after successful signup
            } else {
                setErrorMessage(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage('Network error or server down.');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage('');
        setUsername('');
        setPassword('');
        setConfirmPassword(''); // Clear confirm password
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-box">
                {/* REMOVED Logo Header */}
                <h1>{isLogin ? 'Sign in' : 'Sign up'}</h1>
                <p>{isLogin ? 'Sign in to continue' : 'Sign up to continue'}</p>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your Username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your Password"
                        />
                    </div>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                            />
                        </div>
                    )}
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button type="submit">{isLogin ? 'Sign in' : 'Sign up'}</button>
                </form>

                <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button type="button" className="toggle-button" onClick={toggleMode}>
                        {isLogin ? 'Create Account' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthForm;