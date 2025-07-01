// src/pages/ServiceFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Alert, Spinner } from 'react-bootstrap';
import apiClient from '../api/axiosConfig';

const ServiceFormPage = () => {
    const { carId, serviceId } = useParams();
    const navigate = useNavigate();

    const isEditMode = !!serviceId;

    const [initialValues, setInitialValues] = useState({
        description: '',
        parts_changed: '',
        cost: '',
    });
    const [loading, setLoading] = useState(isEditMode); // Only load if in edit mode
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            apiClient.get(`/manager/services/${serviceId}`)
                .then(response => {
                    const { description, parts_changed, cost } = response.data;
                    setInitialValues({ description, parts_changed, cost });
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch service details.');
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [serviceId, isEditMode]);

    const validationSchema = Yup.object({
        description: Yup.string().required('Service description is required'),
        parts_changed: Yup.string(),
        cost: Yup.number().required('Cost is required').min(0, 'Cost cannot be negative'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setError('');
        try {
            if (isEditMode) {
                await apiClient.put(`/manager/services/${serviceId}`, values);
                // We need the carId to navigate back. The backend response for a single service
                // includes car_id (because we set include_fk=True in the schema).
                const response = await apiClient.get(`/manager/services/${serviceId}`);
                navigate(`/car/${response.data.car_id}`);
            } else {
                await apiClient.post(`/manager/cars/${carId}/services`, values);
                navigate(`/car/${carId}`);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    return (
        <div className="d-flex justify-content-center">
            <Card style={{ width: '32rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">{isEditMode ? 'Edit Service Record' : 'Add Service Record'}</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize // Important for pre-filling form in edit mode
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-3">
                                    <label htmlFor="description">Service Description</label>
                                    <Field name="description" as="textarea" rows={3} className="form-control" />
                                    <ErrorMessage name="description" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="parts_changed">Parts Changed (optional)</label>
                                    <Field name="parts_changed" as="textarea" rows={2} className="form-control" />
                                    <ErrorMessage name="parts_changed" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cost">Total Cost ($)</label>
                                    <Field name="cost" type="number" className="form-control" />
                                    <ErrorMessage name="cost" component="div" className="text-danger" />
                                </div>
                                <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Record' : 'Add Record'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ServiceFormPage;