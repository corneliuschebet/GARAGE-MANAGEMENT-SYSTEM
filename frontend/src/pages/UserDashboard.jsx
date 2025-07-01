// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { ListGroup, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // Corrected path
import AddCarForm from '../components/AddCarForm'; // Corrected path

const UserDashboard = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            const response = await apiClient.get('/my-cars');
            setCars(response.data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleCarAdded = (newCar) => {
        setCars([...cars, newCar]);
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <div>
            <h2>My Garage</h2>
            <Card className="mb-4">
                <Card.Header>Add a New Car</Card.Header>
                <Card.Body>
                    <AddCarForm onCarAdded={handleCarAdded} />
                </Card.Body>
            </Card>

            <h3>My Cars</h3>
            <ListGroup>
                {cars.length > 0 ? cars.map(car => (
                    <ListGroup.Item key={car.id} action as={Link} to={`/car/${car.id}`}>
                        {car.year} {car.make} {car.model} - ({car.registration_number})
                    </ListGroup.Item>
                )) : <p>You haven't added any cars yet.</p>}
            </ListGroup>
        </div>
    );
};

export default UserDashboard;