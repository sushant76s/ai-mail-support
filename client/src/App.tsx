import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Customer Support Assistant</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;