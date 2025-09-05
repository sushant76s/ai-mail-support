import React from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { Email } from '../types';

const sentimentColor = (s: Email['sentiment']) =>
  s === 'POSITIVE' ? 'success' : s === 'NEGATIVE' ? 'error' : 'info';

interface Props {
  email: Email | null;
  open: boolean;
  onClose: () => void;
}

const EmailDetailDialog: React.FC<Props> = ({ email, open, onClose }) => {
  if (!email) return null;

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(email.draftResponse || '');
    } catch {}
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {email.subject}
          </Typography>
          <Chip size="small" color={sentimentColor(email.sentiment)} label={email.sentiment} />
          <Chip
            size="small"
            color={email.priority === 'URGENT' ? 'warning' : 'default'}
            label={email.priority}
            variant={email.priority === 'URGENT' ? 'filled' : 'outlined'}
          />
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {new Date(email.receivedAt).toLocaleString()}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 72 }}>
              From:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {email.sender}
            </Typography>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Body</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {email.body}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Extracted Info</Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'grey.200',
                maxHeight: 240,
                overflow: 'auto',
              }}
            >
              {JSON.stringify(email.extractedInfo ?? {}, null, 2)}
            </Box>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Draft Response</Typography>
              <Tooltip title="Copy to clipboard">
                <IconButton size="small" onClick={copyDraft}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'grey.200',
                maxHeight: 240,
                overflow: 'auto',
              }}
            >
              {email.draftResponse || '—'}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDetailDialog;
