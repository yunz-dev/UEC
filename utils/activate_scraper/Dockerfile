FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y \
    wget \
    ca-certificates \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libwebkit2gtk-4.0-37 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -q -U google-generativeai
RUN pip install python-dotenv

RUN python -m playwright install

COPY main.py /app/

CMD ["python3", "main.py"]
