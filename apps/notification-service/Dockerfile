FROM python:3.9-slim  # Start with a slim Python base image

WORKDIR /app     # Set the working directory

COPY requirements.txt requirements.txt  # Copy the requirements first
RUN pip install -r requirements.txt

COPY . .         # Copy the project files

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8083"] 
