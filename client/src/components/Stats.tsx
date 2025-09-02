import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Stats.css';
import { StatsData } from './Dashboard';

interface Props {
  data: StatsData;
}

const COLORS = {
  POSITIVE: '#2ecc71',
  NEGATIVE: '#e74c3c',
  NEUTRAL: '#3498db',
  URGENT: '#f39c12',
  NOT_URGENT: '#bdc3c7',
};

const Stats: React.FC<Props> = ({ data }) => {
  const sentimentData = data.sentimentCounts.map(item => ({
    name: item.sentiment,
    value: item._count.sentiment,
  }));
  
  const priorityData = data.priorityCounts.map(item => ({
    name: item.priority,
    value: item._count.priority,
  }));

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Emails</h3>
        <p>{data.total}</p>
      </div>
      <div className="stat-card">
        <h3>Received (24h)</h3>
        <p>{data.last24Hours}</p>
      </div>
      <div className="stat-card">
        <h3>Pending</h3>
        <p>{data.total - data.resolved}</p>
      </div>
      <div className="stat-card">
        <h3>Resolved</h3>
        <p>{data.resolved}</p>
      </div>
      <div className="stat-card chart-card">
        <h3>Sentiment</h3>
        <ResponsiveContainer width="100%" height={150}>
            <PieChart>
                <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                    {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
      </div>
       <div className="stat-card chart-card">
        <h3>Priority</h3>
        <ResponsiveContainer width="100%" height={150}>
            <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                    {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;