import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        const response = await api.post('/auth/login', values);
        login(response.data.token, response.data.user);
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={formik.values.password} onChange={formik.handleChange} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing In…' : 'Sign In'}
          </Button>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" textAlign="center">
              {"Don't have an account? Sign Up"}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;