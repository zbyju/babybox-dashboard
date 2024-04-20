from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str
    email: str

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "securepassword123",
                "email": "johndoe@example.com",
            }
        }
