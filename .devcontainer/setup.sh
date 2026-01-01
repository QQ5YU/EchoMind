#!/bin/bash
set -e

echo "🔧 Step 1: Install system dependencies (Python, FFmpeg, build tools)..."
sudo apt-get update && sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libgomp1 \
    ffmpeg \
    git \
    curl

echo "📌 Python version:"
python3 --version

echo "📦 Step 2: Install pnpm (if not already in image)..."
npm install -g pnpm@latest

echo "🐍 Step 3: Upgrade pip and install Python dependencies..."
python3 -m pip install --no-cache-dir --upgrade pip
# python3 -m pip install --no-cache-dir -r requirements.txt

# echo "⚡ Step 4: Install Node.js dependencies with pnpm..."
pnpm install

echo "✅ Dev environment ready!"