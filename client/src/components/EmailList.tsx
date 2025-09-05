import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
  import OpenInNewIcon from '@mui/icons-material/OpenInNew';
  import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
  import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
  import SearchIcon from '@mui/icons-material/Search';
  import MailOutlineIcon from '@mui/icons-material/MailOutline';
import type { Email } from '../types';

interface Props {
  emails: Email[];
  loading?: boolean;
  onOpenEmail: (email: Email) => void;
  selectedEmailId?: string;
}

const sentimentColor = (s: Email['sentiment']) =>
  s === 'POSITIVE' ? 'success' : s === 'NEGATIVE' ? 'error' : 'info';

const EmailList: React.FC<Props> = ({ emails, loading, onOpenEmail, selectedEmailId }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return emails;
    return emails.filter(e =>
      e.sender.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      (e.body || '').toLowerCase().includes(q)
    );
  }, [emails, query]);

  return (
    <Card elevation={1} sx={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <MailOutlineIcon />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Inbox</Typography>
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder="Search sender, subject, or body…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </CardContent>

      <Divider />

      <Box sx={{ overflow: 'auto', flex: 1, px: 1 }}>
        <List disablePadding>
          {loading && filtered.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">Loading emails…</Typography>
            </Box>
          )}

          {!loading && filtered.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">No support emails found.</Typography>
            </Box>
          )}

          {filtered.map((email) => {
            const selected = selectedEmailId === email.id;
            const dateStr = new Date(email.receivedAt).toLocaleString();
            return (
              <ListItemButton
                key={email.id}
                selected={selected}
                onClick={() => onOpenEmail(email)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {email.sender[1]?.toUpperCase() ?? 'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                        {email.sender}
                      </Typography>
                      {email.priority === 'URGENT' && (
                        <Tooltip title="Urgent">
                          <PriorityHighIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                      <Chip
                        size="small"
                        label={email.sentiment}
                        color={sentimentColor(email.sentiment)}
                        variant="outlined"
                      />
                      {email.status === 'RESOLVED' && (
                        <Chip size="small" icon={<MarkEmailReadIcon />} label="Resolved" />
                      )}
                      <Box sx={{ flex: 1 }} />
                      <Typography variant="caption" color="text.secondary">{dateStr}</Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {email.subject}
                    </Typography>
                  }
                />
                <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onOpenEmail(email); }}>
                  <OpenInNewIcon />
                </IconButton>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Card>
  );
};

export default EmailList;
