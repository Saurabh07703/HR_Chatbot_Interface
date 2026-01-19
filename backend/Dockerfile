# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set working directory
# Set working directory to /code to avoid name collisions with 'app' package
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY . /code

# Set PYTHONPATH to include /code so modules can be imported
ENV PYTHONPATH=/code

# Install system dependencies (needed for some python packages)
RUN apt-get update && apt-get install -y build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Files are already copied via 'COPY . /code' above


# Expose port
EXPOSE 8000

# Command to run the application
# Debug: List files to see where 'app' ended up
CMD ["sh", "-c", "ls -R /code && python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
