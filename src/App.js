import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery } from '@tanstack/react-query';

function App() {
  const [theme, setTheme] = useState('dark');
  const [username, setUsername] = useState('');
  
  
  const { data: userData, isLoading, refetch, error } = useQuery({
    queryKey: ['user', username],
    queryFn: async() => {
      if (!username)
        throw new Error('Please enter username')

      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok){
        throw new Error('User not found')
      } 
      
      return response.json();
    },
    enabled: false
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSearch = async () => {
    refetch();
  }

  return (
    <div className="app">
      <header>
        <h1>devfinder</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? 'DARK' : 'LIGHT'}
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </header>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search Github username..." value={username} onChange={(e) => setUsername(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
      </div>

      {isLoading && <div className="message">Loading...</div>}
      {error && <div className="message error">{error.message}</div>}

      {userData && (
        <div className="profile-card">
          <img src={userData.avatar_url} alt={userData.name} className="avatar" />
          <div className="info-container">
            <div className="header">
              <h2>{userData.name}</h2>
              <p className="join-date">Joined {new Date(userData.created_at).toDateString()}</p>
            </div>
            <p className="username">@{userData.login}</p>
            <p className="bio">{userData.bio || 'This profile has no bio'}</p>
            <div className="stats">
              <div>
                <p className="stat-label">Repos</p>
                <p className="stat-value">{userData.public_repos}</p>
              </div>
              <div>
                <p className="stat-label">Followers</p>
                <p className="stat-value">{userData.followers}</p>
              </div>
              <div>
                <p className="stat-label">Following</p>
                <p className="stat-value">{userData.following}</p>
              </div>
            </div>
            <div className="footer">
              <div className="footer-item">
                <span className="icon">📍</span>
                {userData.location || 'Not Available'}
              </div>
              <div className="footer-item">
                <span className="icon">🔗</span>
                {userData.blog ? (
                  <a href={userData.blog} >
                    {userData.blog}
                  </a>
                ) : (
                  'Not Available'
                )}
              </div>
              <div className="footer-item">
                <span className="icon">🐦</span>
                {userData.twitter_username || 'Not Available'}
              </div>
              <div className="footer-item">
                <span className="icon">🏢</span>
                {userData.company || 'Not Available'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;