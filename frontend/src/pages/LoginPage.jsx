// src/pages/LoginPage.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { useState } from 'react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { loginWithUserData } = useAuth();
    const [error, setError] = useState('');

    const initialValues = { username: '', password: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setError('');
        try {
            const response = await apiClient.post('/login', values);
            loginWithUserData(response.data.access_token, response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during login.');
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Card style={{ width: '24rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Login</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-3">
                                    <label htmlFor="username">Username</label>
                                    <Field name="username" type="text" className="form-control" />
                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <Field name="password" type="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>
                                <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <div className="mt-3 text-center">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;