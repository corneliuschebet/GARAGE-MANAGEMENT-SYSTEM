# backend/app/models.py
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    is_manager = db.Column(db.Boolean, default=False, nullable=False)
    cars = db.relationship('Car', backref='owner', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    registration_number = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_records = db.relationship('ServiceRecord', backref='car', lazy=True, cascade="all, delete-orphan")

class ServiceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    service_date = db.Column(db.DateTime, server_default=db.func.now())
    description = db.Column(db.Text, nullable=False) # e.g., "Oil change, tire rotation"
    parts_changed = db.Column(db.Text) # e.g., "Oil filter, front brake pads"
    cost = db.Column(db.Float, nullable=False)