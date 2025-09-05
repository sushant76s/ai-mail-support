import React from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StatsData } from '../types';

const COLORS: Record<string, string> = {
  POSITIVE: '#2ecc71',
  NEGATIVE: '#e74c3c',
  NEUTRAL:  '#3498db',
  URGENT: '#f39c12',
  NOT_URGENT: '#95a5a6',
};

const StatBlock: React.FC<{ title: string; value?: number; loading?: boolean }> = ({ title, value, loading }) => (
  <Card elevation={1}>
    <CardContent>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      {loading ? <Skeleton variant="text" width={80} height={40} /> : (
        <Typography variant="h4" sx={{ fontWeight: 800 }}>{value ?? 0}</Typography>
      )}
    </CardContent>
  </Card>
);

const ChartCard: React.FC<{ title: string; data: Array<{ name: string; value: number }>; loading?: boolean }> = ({ title, data, loading }) => (
  <Card elevation={1} sx={{ height: 350 }}>
    <CardHeader title={title} />
    <CardContent sx={{ height: 300 }}>
      {loading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[entry.name] ?? '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
);

const Stats: React.FC<{ data: StatsData; loading?: boolean }> = ({ data, loading }) => {
  const sentimentData = (data.sentimentCounts ?? []).map(s => ({
    name: s.sentiment,
    value: s._count?.sentiment ?? 0,
  }));
  const priorityData = (data.priorityCounts ?? []).map(p => ({
    name: p.priority,
    value: p._count?.priority ?? 0,
  }));

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3, md: 6, lg: 6 }}>
          <StatBlock title="Total Emails" value={data.total} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 6, lg: 6 }}>
          <StatBlock title="Received (24h)" value={data.last24Hours} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 6, lg: 6 }}>
          <StatBlock title="Pending" value={data.total - data.resolved} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 6, lg: 6 }}>
          <StatBlock title="Resolved" value={data.resolved} loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <ChartCard title="Sentiment" data={sentimentData} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ChartCard title="Priority" data={priorityData} loading={loading} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Stats;
