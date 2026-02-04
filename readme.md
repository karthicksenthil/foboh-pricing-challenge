# 🚀 Quick Start Guide

## Installation (2 minutes)


### Manual Installation
```bash
# Backend
cd foboh-pricing-challenge/backend
npm install

# Frontend (in a new terminal)
cd foboh-pricing-challenge/frontend
npm install
```

## Running the Application (30 seconds)

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
✅ Server running at http://localhost:3001  
✅ API docs at http://localhost:3001/api-docs

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
✅ App running at http://localhost:5173

## Deploying the Application

### Manual Deploy
```bash
# Production deploy, build front and backend and start server
cd foboh-pricing-challenge
npm install

npm run deploy
```

### Docker Deploy
```bash
# Production deploy, build front and backend and start server
cd foboh-pricing-challenge
docker build -t foboh-pricing-challenge .

docker run -d -p 3001:3001 --name pricing-app foboh-pricing-challenge
```

## First Use Tutorial (2 minutes)

### Step 1: Search & Filter Products
1. Open http://localhost:5173 in your browser
2. Try searching for "Koyama" in the search box
3. Or use the filters to find specific product types

### Step 2: Select Products
1. Check the boxes next to products you want to adjust
2. Or click the header checkbox to select all

### Step 3: Configure Price Adjustment
1. Choose adjustment type:
   - **Fixed**: Adjust by dollar amount (e.g., +$10 or -$5)
   - **Dynamic**: Adjust by percentage (e.g., +15% or -10%)
2. Select direction (Increase or Decrease)
3. Enter the value

### Step 4: Preview Calculations
1. Click "Calculate Prices" button
2. See the new prices in the table
3. Review "Based On" vs "New Price" columns

### Step 5: Save Profile (Optional)
1. Enter a profile name (e.g., "VIP Discount")
2. Click "Save Profile"
3. Success message appears!
