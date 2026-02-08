/**
 * Data Analytics Platform
 * Traditional JavaScript Implementation
 * Uses Node.js built-in modules: http, fs, url, querystring
 */

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

// Configuration
var PORT = 3000;
var DATA_FILE = './analytics-data.json';

// In-memory data store
var analyticsData = {
    pageViews: [],
    events: [],
    users: [],
    sessions: []
};

/**
 * Initialize the data store
 */
function initializeDataStore() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            var fileContent = fs.readFileSync(DATA_FILE, 'utf8');
            analyticsData = JSON.parse(fileContent);
            console.log('Data loaded from file successfully');
        } catch (error) {
            console.log('Error loading data file, using empty store:', error.message);
        }
    } else {
        console.log('No existing data file found, starting fresh');
    }
}

/**
 * Save data to file
 */
function saveDataToFile() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(analyticsData, null, 2));
        console.log('Data saved successfully');
    } catch (error) {
        console.log('Error saving data:', error.message);
    }
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Track page view
 */
function trackPageView(data) {
    var pageView = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        page: data.page || '/',
        userId: data.userId || 'anonymous',
        sessionId: data.sessionId || generateId(),
        referrer: data.referrer || '',
        userAgent: data.userAgent || ''
    };
    
    analyticsData.pageViews.push(pageView);
    saveDataToFile();
    
    return pageView;
}

/**
 * Track custom event
 */
function trackEvent(data) {
    var event = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        eventName: data.eventName || 'custom_event',
        category: data.category || 'general',
        userId: data.userId || 'anonymous',
        sessionId: data.sessionId || generateId(),
        properties: data.properties || {}
    };
    
    analyticsData.events.push(event);
    saveDataToFile();
    
    return event;
}

/**
 * Register or update user
 */
function registerUser(data) {
    var existingUserIndex = -1;
    
    for (var i = 0; i < analyticsData.users.length; i++) {
        if (analyticsData.users[i].userId === data.userId) {
            existingUserIndex = i;
            break;
        }
    }
    
    var user = {
        userId: data.userId || generateId(),
        email: data.email || '',
        name: data.name || '',
        registeredAt: existingUserIndex === -1 ? new Date().toISOString() : analyticsData.users[existingUserIndex].registeredAt,
        lastSeen: new Date().toISOString(),
        metadata: data.metadata || {}
    };
    
    if (existingUserIndex !== -1) {
        analyticsData.users[existingUserIndex] = user;
    } else {
        analyticsData.users.push(user);
    }
    
    saveDataToFile();
    return user;
}

/**
 * Get analytics statistics
 */
function getStatistics(timeRange) {
    var now = new Date();
    var startTime = new Date(now.getTime() - (timeRange || 24) * 60 * 60 * 1000);
    
    var filteredPageViews = analyticsData.pageViews.filter(function(pv) {
        return new Date(pv.timestamp) >= startTime;
    });
    
    var filteredEvents = analyticsData.events.filter(function(ev) {
        return new Date(ev.timestamp) >= startTime;
    });
    
    var uniqueUsers = {};
    filteredPageViews.forEach(function(pv) {
        uniqueUsers[pv.userId] = true;
    });
    
    var pageStats = {};
    filteredPageViews.forEach(function(pv) {
        pageStats[pv.page] = (pageStats[pv.page] || 0) + 1;
    });
    
    var eventStats = {};
    filteredEvents.forEach(function(ev) {
        eventStats[ev.eventName] = (eventStats[ev.eventName] || 0) + 1;
    });
    
    return {
        timeRange: timeRange + ' hours',
        totalPageViews: filteredPageViews.length,
        totalEvents: filteredEvents.length,
        uniqueUsers: Object.keys(uniqueUsers).length,
        topPages: pageStats,
        topEvents: eventStats,
        totalUsers: analyticsData.users.length
    };
}

/**
 * Get user journey
 */
function getUserJourney(userId) {
    var userPageViews = analyticsData.pageViews.filter(function(pv) {
        return pv.userId === userId;
    }).sort(function(a, b) {
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
    
    var userEvents = analyticsData.events.filter(function(ev) {
        return ev.userId === userId;
    }).sort(function(a, b) {
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
    
    return {
        userId: userId,
        pageViews: userPageViews,
        events: userEvents,
        totalActions: userPageViews.length + userEvents.length
    };
}

/**
 * Generate HTML dashboard
 */
function generateDashboard(stats) {
    var html = '<!DOCTYPE html>\n';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>Analytics Platform Dashboard</title>\n';
    html += '    <style>\n';
    html += '        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }\n';
    html += '        .container { max-width: 1200px; margin: 0 auto; }\n';
    html += '        h1 { color: #333; }\n';
    html += '        .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n';
    html += '        .stat { display: inline-block; margin: 10px 20px 10px 0; }\n';
    html += '        .stat-value { font-size: 32px; font-weight: bold; color: #0066cc; }\n';
    html += '        .stat-label { color: #666; margin-top: 5px; }\n';
    html += '        table { width: 100%; border-collapse: collapse; margin-top: 10px; }\n';
    html += '        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }\n';
    html += '        th { background: #f0f0f0; font-weight: bold; }\n';
    html += '        .nav { margin: 20px 0; }\n';
    html += '        .nav a { margin-right: 15px; color: #0066cc; text-decoration: none; }\n';
    html += '        .nav a:hover { text-decoration: underline; }\n';
    html += '    </style>\n';
    html += '</head>\n';
    html += '<body>\n';
    html += '    <div class="container">\n';
    html += '        <h1>📊 Data Analytics Platform</h1>\n';
    html += '        <div class="nav">\n';
    html += '            <a href="/">Dashboard</a>\n';
    html += '            <a href="/stats?hours=1">Last Hour</a>\n';
    html += '            <a href="/stats?hours=24">Last 24 Hours</a>\n';
    html += '            <a href="/stats?hours=168">Last Week</a>\n';
    html += '            <a href="/api/data">View Raw Data</a>\n';
    html += '        </div>\n';
    html += '        <div class="card">\n';
    html += '            <h2>Overview (' + stats.timeRange + ')</h2>\n';
    html += '            <div class="stat">\n';
    html += '                <div class="stat-value">' + stats.totalPageViews + '</div>\n';
    html += '                <div class="stat-label">Page Views</div>\n';
    html += '            </div>\n';
    html += '            <div class="stat">\n';
    html += '                <div class="stat-value">' + stats.uniqueUsers + '</div>\n';
    html += '                <div class="stat-label">Unique Users</div>\n';
    html += '            </div>\n';
    html += '            <div class="stat">\n';
    html += '                <div class="stat-value">' + stats.totalEvents + '</div>\n';
    html += '                <div class="stat-label">Events</div>\n';
    html += '            </div>\n';
    html += '            <div class="stat">\n';
    html += '                <div class="stat-value">' + stats.totalUsers + '</div>\n';
    html += '                <div class="stat-label">Total Users</div>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '        <div class="card">\n';
    html += '            <h2>Top Pages</h2>\n';
    html += '            <table>\n';
    html += '                <tr><th>Page</th><th>Views</th></tr>\n';
    
    for (var page in stats.topPages) {
        html += '                <tr><td>' + page + '</td><td>' + stats.topPages[page] + '</td></tr>\n';
    }
    
    html += '            </table>\n';
    html += '        </div>\n';
    html += '        <div class="card">\n';
    html += '            <h2>Top Events</h2>\n';
    html += '            <table>\n';
    html += '                <tr><th>Event</th><th>Count</th></tr>\n';
    
    for (var event in stats.topEvents) {
        html += '                <tr><td>' + event + '</td><td>' + stats.topEvents[event] + '</td></tr>\n';
    }
    
    html += '            </table>\n';
    html += '        </div>\n';
    html += '    </div>\n';
    html += '</body>\n';
    html += '</html>';
    
    return html;
}

/**
 * Handle HTTP requests
 */
function handleRequest(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    var query = parsedUrl.query;
    
    console.log(req.method + ' ' + pathname);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Dashboard
    if (pathname === '/' && req.method === 'GET') {
        var hours = parseInt(query.hours) || 24;
        var stats = getStatistics(hours);
        var html = generateDashboard(stats);
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }
    
    // Statistics API
    if (pathname === '/stats' && req.method === 'GET') {
        var hours = parseInt(query.hours) || 24;
        var stats = getStatistics(hours);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats, null, 2));
        return;
    }
    
    // Track page view
    if (pathname === '/api/track/pageview' && req.method === 'POST') {
        var body = '';
        
        req.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        req.on('end', function() {
            try {
                var data = JSON.parse(body);
                var result = trackPageView(data);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Track event
    if (pathname === '/api/track/event' && req.method === 'POST') {
        var body = '';
        
        req.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        req.on('end', function() {
            try {
                var data = JSON.parse(body);
                var result = trackEvent(data);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Register user
    if (pathname === '/api/users' && req.method === 'POST') {
        var body = '';
        
        req.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        req.on('end', function() {
            try {
                var data = JSON.parse(body);
                var result = registerUser(data);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Get user journey
    if (pathname.startsWith('/api/users/') && pathname.endsWith('/journey') && req.method === 'GET') {
        var userId = pathname.split('/')[3];
        var journey = getUserJourney(userId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(journey, null, 2));
        return;
    }
    
    // Get all data
    if (pathname === '/api/data' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(analyticsData, null, 2));
        return;
    }
    
    // Clear all data
    if (pathname === '/api/clear' && req.method === 'POST') {
        analyticsData = {
            pageViews: [],
            events: [],
            users: [],
            sessions: []
        };
        saveDataToFile();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'All data cleared' }));
        return;
    }
    
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
}

/**
 * Start the server
 */
function startServer() {
    initializeDataStore();
    
    var server = http.createServer(handleRequest);
    
    server.listen(PORT, function() {
        console.log('=====================================');
        console.log('Data Analytics Platform Started');
        console.log('=====================================');
        console.log('Server running at http://localhost:' + PORT);
        console.log('Dashboard: http://localhost:' + PORT + '/');
        console.log('API Endpoints:');
        console.log('  - POST /api/track/pageview');
        console.log('  - POST /api/track/event');
        console.log('  - POST /api/users');
        console.log('  - GET  /api/users/{userId}/journey');
        console.log('  - GET  /stats?hours=24');
        console.log('  - GET  /api/data');
        console.log('  - POST /api/clear');
        console.log('=====================================');
    });
    
    server.on('error', function(error) {
        console.error('Server error:', error.message);
    });
}

// Start the server
startServer();
