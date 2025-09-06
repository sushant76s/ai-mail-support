import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        setSuccess('');
        await api.post('/auth/signup', values);
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={formik.values.password} onChange={formik.handleChange} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing Up…' : 'Sign Up'}
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" textAlign="center">
              {"Already have an account? Sign In"}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;