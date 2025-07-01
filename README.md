# Car Garage Management System

A full-stack web application designed to manage vehicles and their service records in a car garage. This system provides a RESTful API backend built with Flask and a responsive, modern frontend user interface built with React.

Users can sign up, log their vehicles, and view service history. Garage managers have a separate interface to view all vehicles in the system, add/update/delete service records, and manage costs.

**Live Frontend Demo**: [https://garage-management-system-black.vercel.app/]  
**Live Backend API**: [https://garage-management-system-tjt9.onrender.com/]


## Features

### User Features

- **Secure Authentication**: Users can sign up and log in securely using JWT (JSON Web Tokens).
- **Add Cars**: Add vehicles by Make, Model, Registration Year, and Number.
- **Dashboard**: View a list of all your registered cars.
- **View Service History**: View a detailed, read-only list of service records for each car.

### Manager Features

- **Protected Manager Role**: Assigned at signup using a secret code.
- **Full CRUD on Services**: Create, read, update, and delete service records.
- **View All Vehicles**: Central dashboard listing all cars in the system.
- **Manage Service Records**: Add/edit/delete service records with descriptions, parts, and cost details.


##  Tech Stack

###  Backend
- **Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: Flask-SQLAlchemy
- **Migrations**: Flask-Migrate
- **Authentication**: Flask-JWT-Extended
- **Serialization**: Flask-Marshmallow
- **CORS**: Flask-Cors
- **Production Server**: Gunicorn

###  Frontend
- **Framework**: React (with Vite)
- **UI Components**: React Bootstrap
- **Styling**: Bootstrap + Custom CSS Modules
- **State Management**: React Context API
- **Forms**: Formik
- **Validation**: Yup
- **HTTP Client**: Axios

