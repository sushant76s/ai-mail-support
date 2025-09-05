import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Grid, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material';
import { api } from '../api';
import type { Email, StatsData } from '../types';
import Stats from './Stats';
import EmailList from './EmailList';
import EmailDetailDialog from './EmailDetailDialog';

const POLL_MS = 30000;

const Dashboard: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [emailsRes, statsRes] = await Promise.all([
        api.get<Email[]>('/emails'),
        api.get<StatsData>('/stats'),
      ]);
      setEmails(emailsRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (e) {
      setError('Failed to fetch data. Make sure the backend server is running.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const pendingCount = useMemo(() => {
    return emails.filter(e => e.status !== 'RESOLVED').length;
  }, [emails]);

  return (
    <Box>
      <Grid container spacing={3} alignItems="flex-start">
        {/* LEFT: Stats (sticky on desktop) */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Box sx={{ position: isMdUp ? 'sticky' : 'static', top: 16 }}>
            <Stats
              data={
                stats ?? {
                  total: emails.length,
                  pending: pendingCount,
                  resolved: emails.length - pendingCount,
                  last24Hours: 0,
                  sentimentCounts: [],
                  priorityCounts: [],
                }
              }
              loading={loading}
            />
          </Box>
        </Grid>

        {/* RIGHT: Email List */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <EmailList
            emails={emails}
            loading={loading}
            onOpenEmail={setSelectedEmail}
            selectedEmailId={selectedEmail?.id}
          />
        </Grid>
      </Grid>

      <EmailDetailDialog
        email={selectedEmail}
        open={Boolean(selectedEmail)}
        onClose={() => setSelectedEmail(null)}
      />

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
