import React from 'react';
import { Email } from './Dashboard';
import './EmailList.css';

interface Props {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string;
}

const getPriorityClass = (priority: string) => {
    return priority === 'URGENT' ? 'priority-urgent' : '';
}

const EmailList: React.FC<Props> = ({ emails, onSelectEmail, selectedEmailId }) => {
  return (
    <div className="email-list">
      <h2>Inbox</h2>
      {emails.length === 0 && <p>No support emails found.</p>}
      {emails.map((email) => (
        <div
          key={email.id}
          className={`email-item ${getPriorityClass(email.priority)} ${selectedEmailId === email.id ? 'selected' : ''}`}
          onClick={() => onSelectEmail(email)}
        >
          <div className="email-header">
            <strong>{email.sender}</strong>
            <span className="email-date">{new Date(email.receivedAt).toLocaleString()}</span>
          </div>
          <div className="email-subject">{email.subject}</div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;