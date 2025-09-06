import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../api';
import { Box, Button, Container, TextField, Typography, Alert, Card, CardContent, CardHeader, CircularProgress, Snackbar } from '@mui/material';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const formik = useFormik({
    initialValues: {
      imapUser: '',
      imapPassword: '',
      imapHost: 'imap.gmail.com',
      imapPort: 993,
    },
    validationSchema: Yup.object({
      imapUser: Yup.string().email('Must be a valid email').required('Required'),
      imapPassword: Yup.string().required('App Password is required'),
      imapHost: Yup.string().required('Required'),
      imapPort: Yup.number().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        await api.post('/user/credentials', values);
        setSnackbar({ open: true, message: 'Credentials saved successfully!' });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/me');
        if (data.imapUser) {
          formik.setValues({
            imapUser: data.imapUser,
            imapPassword: '', // Don't pre-fill password
            imapHost: data.imapHost,
            imapPort: data.imapPort,
          });
        }
      } catch (e) {
        setError('Could not fetch profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <CardHeader title="IMAP Credentials" subheader="Configure your email account for fetching support tickets" />
          <CardContent>
            {loading ? <CircularProgress /> : (
              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Provide the credentials for the email account you want to monitor. For Gmail, you must use an "App Password".
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField margin="normal" fullWidth required label="IMAP User (your email)" name="imapUser" value={formik.values.imapUser} onChange={formik.handleChange} error={formik.touched.imapUser && Boolean(formik.errors.imapUser)} helperText={formik.touched.imapUser && formik.errors.imapUser} />
                <TextField margin="normal" fullWidth required label="IMAP App Password" name="imapPassword" type="password" placeholder="Enter new app password to update" value={formik.values.imapPassword} onChange={formik.handleChange} error={formik.touched.imapPassword && Boolean(formik.errors.imapPassword)} helperText={formik.touched.imapPassword && formik.errors.imapPassword} />
                <TextField margin="normal" fullWidth required label="IMAP Host" name="imapHost" value={formik.values.imapHost} onChange={formik.handleChange} error={formik.touched.imapHost && Boolean(formik.errors.imapHost)} helperText={formik.touched.imapHost && formik.errors.imapHost} />
                <TextField margin="normal" fullWidth required label="IMAP Port" name="imapPort" type="number" value={formik.values.imapPort} onChange={formik.handleChange} error={formik.touched.imapPort && Boolean(formik.errors.imapPort)} helperText={formik.touched.imapPort && formik.errors.imapPort} />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Saving…' : 'Save Credentials'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
      </Container>
    </>
  );
};

export default ProfilePage;