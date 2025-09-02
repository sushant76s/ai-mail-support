import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import EmailList from './EmailList';
import EmailList from './EmailList';
// import Stats from './Stats';
import Stats from './Stats';
import './Dashboard.css';

const API_URL = 'http://localhost:3001/api';

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  priority: 'URGENT' | 'NOT_URGENT';
  extractedInfo: any;
  draftResponse: string;
  status: 'PENDING' | 'PROCESSED' | 'RESOLVED';
}

export interface StatsData {
    total: number;
    pending: number;
    resolved: number;
    last24Hours: number;
    sentimentCounts: any[];
    priorityCounts: any[];
}


const Dashboard: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [emailsRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/emails`),
          axios.get(`${API_URL}/stats`),
        ]);
        setEmails(emailsRes.data);
        setStats(statsRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Poll for new data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard-container">
      {stats && <Stats data={stats} />}
      <div className="emails-section">
        <EmailList emails={emails} onSelectEmail={setSelectedEmail} selectedEmailId={selectedEmail?.id} />
        {/* EmailDetail component will go here */}
      </div>
    </div>
  );
};

export default Dashboard;