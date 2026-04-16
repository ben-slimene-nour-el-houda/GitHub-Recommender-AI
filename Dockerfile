# --- Stage 1: Build Frontend ---
FROM node:22-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Image ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libopenblas-dev \
    libomp-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY data/ ./data/
COPY index/ ./index/

# Copy frontend build to a directory where FastAPI can serve it (optional)
# or keep it separate as in docker-compose
COPY --from frontend-build /app/frontend/dist ./frontend/dist

# Expose ports
EXPOSE 8000

# Start command (we'll use docker-compose to manage services)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
