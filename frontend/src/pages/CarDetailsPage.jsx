// src/pages/CarDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

const CarDetailsPage = () => {
    const { carId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await apiClient.get(`/cars/${carId}`);
                setCar(response.data);
            } catch (err) {
                setError('Failed to fetch car details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [carId]);

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service record?')) {
            try {
                await apiClient.delete(`/manager/services/${serviceId}`);
                // Update state to reflect deletion without a page reload
                setCar(prevCar => ({
                    ...prevCar,
                    service_records: prevCar.service_records.filter(sr => sr.id !== serviceId),
                }));
            } catch (err) {
                setError('Failed to delete service record.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!car) {
        return <Alert variant="warning">Car not found.</Alert>;
    }

    return (
        <>
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
                ← Back
            </Button>
            <Card className="mb-4">
                <Card.Header>
                    <Card.Title as="h2">{car.year} {car.make} {car.model}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Registration: {car.registration_number}</Card.Subtitle>
                </Card.Header>
            </Card>

            <h3>Service History</h3>
            {car.service_records.length > 0 ? (
                <ListGroup>
                    {car.service_records.map(record => (
                        <ListGroup.Item key={record.id} className="mb-3">
                            <Row>
                                <Col md={9}>
                                    <strong>Date:</strong> {new Date(record.service_date).toLocaleDateString()}<br />
                                    <strong>Description:</strong> {record.description}<br />
                                    <strong>Parts Changed:</strong> {record.parts_changed || 'N/A'}<br />
                                    <strong>Cost:</strong> ${record.cost.toFixed(2)}
                                </Col>
                                {user?.is_manager && (
                                    <Col md={3} className="d-flex align-items-center justify-content-end">
                                        <Button as={Link} to={`/manager/service/${record.id}/edit`} variant="warning" size="sm" className="me-2">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(record.id)} variant="danger" size="sm">
                                            Delete
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="info">No service records found for this vehicle.</Alert>
            )}
        </>
    );
};

export default CarDetailsPage;