# backend/app/schemas.py
from app import ma
from .models import User, Car, ServiceRecord

class ServiceRecordSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ServiceRecord
        include_fk = True # Include foreign keys

class CarSchema(ma.SQLAlchemyAutoSchema):
    service_records = ma.Nested(ServiceRecordSchema, many=True)
    class Meta:
        model = Car
        include_fk = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    cars = ma.Nested(CarSchema, many=True)
    class Meta:
        model = User
        # Exclude password hash from serialization for security
        exclude = ('password_hash',)

# Init schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
car_schema = CarSchema()
cars_schema = CarSchema(many=True)
service_record_schema = ServiceRecordSchema()
service_records_schema = ServiceRecordSchema(many=True)