// src/pages/ManagerDashboard.jsx
import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const ManagerDashboard = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllCars = async () => {
            try {
                const response = await apiClient.get('/manager/cars');
                // We need owner info, but our schema doesn't provide it yet.
                // For now, we'll just show the car details.
                // A better implementation would adjust the backend schema to include owner's username.
                setCars(response.data);
            } catch (err) {
                setError('Failed to fetch cars. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCars();
    }, []);

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Manager Dashboard: All Cars</h2>
            <p>View all registered vehicles and manage their service records.</p>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Registration Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.length > 0 ? (
                        cars.map((car, index) => (
                            <tr key={car.id}>
                                <td>{index + 1}</td>
                                <td>{car.make}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.registration_number}</td>
                                <td>
                                    <Button as={Link} to={`/car/${car.id}`} variant="info" size="sm" className="me-2">
                                        View Details
                                    </Button>
                                    <Button as={Link} to={`/manager/car/${car.id}/add-service`} variant="success" size="sm">
                                        Add Service
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No cars found in the system.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ManagerDashboard;