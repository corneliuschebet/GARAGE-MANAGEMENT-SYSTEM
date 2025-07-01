// src/components/AddCarForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Alert } from 'react-bootstrap';
import apiClient from '../api/axiosConfig';
import { useState } from 'react';

const AddCarForm = ({ onCarAdded }) => {
    const [error, setError] = useState('');
    
    const initialValues = { make: '', model: '', year: '', registration_number: '' };

    const validationSchema = Yup.object({
        make: Yup.string().required('Make is required'),
        model: Yup.string().required('Model is required'),
        year: Yup.number().required('Year is required').min(1900).max(new Date().getFullYear() + 1, "Year cannot be in the future"),
        registration_number: Yup.string().required('Registration number is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setError('');
        try {
            const response = await apiClient.post('/cars', values);
            onCarAdded(response.data);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add car.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="make" className="form-label">Make</label>
                                <Field name="make" type="text" placeholder="e.g., Toyota" className="form-control" />
                                <ErrorMessage name="make" component="div" className="text-danger small" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="model" className="form-label">Model</label>
                                <Field name="model" type="text" placeholder="e.g., Camry" className="form-control" />
                                <ErrorMessage name="model" component="div" className="text-danger small" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="year" className="form-label">Year</label>
                                <Field name="year" type="number" placeholder="e.g., 2022" className="form-control" />
                                <ErrorMessage name="year" component="div" className="text-danger small" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="registration_number" className="form-label">Registration No.</label>
                                <Field name="registration_number" type="text" placeholder="e.g., KDA 123X" className="form-control" />
                                <ErrorMessage name="registration_number" component="div" className="text-danger small" />
                            </div>
                        </div>
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Car'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};
export default AddCarForm;