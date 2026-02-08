# Data-Analytics-Dashboard-in-Node.js-
Data Analytics Dashboard in Node.js 

# Data Analytics Platform

A complete Data Analytics Platform built with traditional JavaScript (ES5 style) using Node.js built-in modules only.

## Features

- **Page View Tracking**: Track user page views with session information
- **Event Tracking**: Track custom events with properties
- **User Management**: Register and track users
- **Statistics Dashboard**: Real-time analytics dashboard
- **Data Persistence**: All data saved to JSON file
- **User Journey Analysis**: Track individual user paths
- **REST API**: Full RESTful API for integration

## Requirements

- Node.js (version 8.0 or higher)
- No external dependencies required!

## Installation

No installation needed! All code uses Node.js built-in modules.

## Running the Server

```bash
node analytics-platform.js
```

The server will start on http://localhost:3000

## Testing the Platform

Run the test client in a separate terminal:

```bash
node test-client.js
```

This will generate sample data and display the results.

## API Endpoints

### Track Page View
```bash
POST /api/track/pageview
Content-Type: application/json

{
  "page": "/home",
  "userId": "user_123",
  "sessionId": "session_abc",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0..."
}
```

### Track Custom Event
```bash
POST /api/track/event
Content-Type: application/json

{
  "eventName": "button_click",
  "category": "engagement",
  "userId": "user_123",
  "sessionId": "session_abc",
  "properties": {
    "buttonId": "cta_subscribe",
    "page": "/products"
  }
}
```

### Register User
```bash
POST /api/users
Content-Type: application/json

{
  "userId": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "metadata": {
    "plan": "premium",
    "signupSource": "google"
  }
}
```

### Get Statistics
```bash
GET /stats?hours=24
```

Returns analytics for the last N hours (default: 24)

### Get User Journey
```bash
GET /api/users/{userId}/journey
```

Returns all page views and events for a specific user

### Get All Data
```bash
GET /api/data
```

Returns all stored analytics data

### Clear All Data
```bash
POST /api/clear
```

Clears all analytics data

## Dashboard

Visit http://localhost:3000 in your browser to see the analytics dashboard.

Dashboard views:
- http://localhost:3000/ - Last 24 hours (default)
- http://localhost:3000/?hours=1 - Last hour
- http://localhost:3000/?hours=168 - Last week

## Data Storage

All data is automatically saved to `analytics-data.json` in the same directory as the server.

## Example Usage with cURL

### Track a page view:
```bash
curl -X POST http://localhost:3000/api/track/pageview \
  -H "Content-Type: application/json" \
  -d '{"page":"/home","userId":"user_001"}'
```

### Track an event:
```bash
curl -X POST http://localhost:3000/api/track/event \
  -H "Content-Type: application/json" \
  -d '{"eventName":"purchase","category":"conversion","userId":"user_001","properties":{"amount":99.99}}'
```

### Get statistics:
```bash
curl http://localhost:3000/stats?hours=24
```

## Architecture

The platform uses:
- **http** module for the web server
- **fs** module for data persistence
- **url** module for parsing URLs
- **querystring** module for query parameters
- Traditional JavaScript (var, function declarations)
- No arrow functions or modern ES6+ features
- No external dependencies

## Code Style

This project follows traditional JavaScript conventions:
- Uses `var` instead of `const` or `let`
- Uses traditional `function` declarations instead of arrow functions
- Compatible with older Node.js versions
- No ES6+ features

## Data Structure

### Page View Object
```javascript
{
  "id": "unique_id",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "page": "/home",
  "userId": "user_123",
  "sessionId": "session_abc",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0..."
}
```

### Event Object
```javascript
{
  "id": "unique_id",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "eventName": "button_click",
  "category": "engagement",
  "userId": "user_123",
  "sessionId": "session_abc",
  "properties": {
    "buttonId": "cta_subscribe"
  }
}
```

### User Object
```javascript
{
  "userId": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "registeredAt": "2024-01-01T12:00:00.000Z",
  "lastSeen": "2024-01-01T12:30:00.000Z",
  "metadata": {
    "plan": "premium"
  }
}
```

## License

MIT License - Free to use and modify

