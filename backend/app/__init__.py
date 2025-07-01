# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for /api/ routes
    migrate.init_app(app, db)

    from app import routes, models # Import models to be registered with migrate

    # Register Blueprints or Routes
    # For simplicity, we'll define routes in routes.py and import them
    routes.init_app(app)

    return app