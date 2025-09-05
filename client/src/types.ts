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
  sentimentCounts: Array<{ sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; _count: { sentiment: number } }>;
  priorityCounts: Array<{ priority: 'URGENT' | 'NOT_URGENT'; _count: { priority: number } }>;
}
