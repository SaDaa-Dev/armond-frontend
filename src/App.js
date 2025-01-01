import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import './styles/App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="app-container">
            {token ? (
                <div className="welcome-container">
                    <h1>로그인 성공</h1>
                    <button 
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App; 