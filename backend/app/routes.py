# backend/app/routes.py
from flask import request, jsonify
from functools import wraps
from app import db
from .models import User, Car, ServiceRecord
from .schemas import user_schema, car_schema, cars_schema, service_record_schema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# --- Custom Decorators ---
def manager_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or not user.is_manager:
                return jsonify(msg="Managers only!"), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# All routes must be defined inside this function
def init_app(app):
    # --- Authentication Routes ---
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password') or not data.get('email'):
            return jsonify(msg="Missing username, email, or password"), 400
        if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
            return jsonify(msg="User with this username or email already exists"), 400

        is_first_user = User.query.count() == 0
        new_user = User(username=data['username'], email=data['email'], is_manager=is_first_user)
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(msg="User created successfully"), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return jsonify(msg="Missing username or password"), 400
        
        user = User.query.filter_by(username=data['username']).first()

        if user and user.check_password(data['password']):
            # Add user info to the token or the response body
            # Here we add it to the response body for simplicity on the frontend
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token, user={'id': user.id, 'username': user.username, 'is_manager': user.is_manager})
        
        return jsonify(msg="Bad username or password"), 401

    # --- User-specific Car Routes ---
    @app.route('/api/my-cars', methods=['GET'])
    @jwt_required()
    def get_my_cars():
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        return cars_schema.dump(user.cars)

    @app.route('/api/cars', methods=['POST'])
    @jwt_required()
    def add_car():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        if not all(k in data for k in ('make', 'model', 'year', 'registration_number')):
            return jsonify(msg="Missing car details"), 400
            
        new_car = Car(
            make=data['make'],
            model=data['model'],
            year=data['year'],
            registration_number=data['registration_number'],
            user_id=current_user_id
        )
        db.session.add(new_car)
        db.session.commit()
        return car_schema.dump(new_car), 201
    
    @app.route('/api/cars/<int:car_id>', methods=['GET'])
    @jwt_required()
    def get_car_details(car_id):
        car = Car.query.get_or_404(car_id)
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if car.user_id != current_user_id and not user.is_manager:
            return jsonify(msg="Access denied"), 403
        
        return car_schema.dump(car)

    # --- Manager Routes ---
    @app.route('/api/manager/cars', methods=['GET'])
    @manager_required()
    def get_all_cars():
        all_cars = Car.query.all()
        return cars_schema.dump(all_cars)
    
    @app.route('/api/manager/cars/<int:car_id>/services', methods=['POST'])
    @manager_required()
    def add_service_record(car_id):
        car = Car.query.get_or_404(car_id)
        data = request.get_json()

        if not all(k in data for k in ('description', 'cost')):
            return jsonify(msg="Missing service description or cost"), 400

        new_service = ServiceRecord(
            description=data['description'],
            parts_changed=data.get('parts_changed', ''),
            cost=data['cost'],
            car_id=car.id
        )
        db.session.add(new_service)
        db.session.commit()
        return service_record_schema.dump(new_service), 201

    # --- CORRECTED CONSOLIDATED ROUTE FOR SERVICES ---
    @app.route('/api/manager/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'])
    @manager_required()
    def handle_service_record(service_id):
        service = ServiceRecord.query.get_or_404(service_id)

        if request.method == 'GET':
            return service_record_schema.dump(service)

        if request.method == 'PUT':
            data = request.get_json()
            service.description = data.get('description', service.description)
            service.parts_changed = data.get('parts_changed', service.parts_changed)
            service.cost = data.get('cost', service.cost)
            db.session.commit()
            return service_record_schema.dump(service)

        if request.method == 'DELETE':
            db.session.delete(service)
            db.session.commit()
            return jsonify(msg=f"Service record {service_id} deleted"), 200