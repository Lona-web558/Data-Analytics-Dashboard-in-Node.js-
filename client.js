/**
 * Test Client for Data Analytics Platform
 * Demonstrates how to send data to the analytics platform
 */

var http = require('http');

var HOST = 'localhost';
var PORT = 3000;

/**
 * Make HTTP request
 */
function makeRequest(method, path, data, callback) {
    var options = {
        hostname: HOST,
        port: PORT,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var req = http.request(options, function(res) {
        var body = '';
        
        res.on('data', function(chunk) {
            body += chunk;
        });
        
        res.on('end', function() {
            try {
                var response = JSON.parse(body);
                callback(null, response);
            } catch (error) {
                callback(error, null);
            }
        });
    });
    
    req.on('error', function(error) {
        callback(error, null);
    });
    
    if (data) {
        req.write(JSON.stringify(data));
    }
    
    req.end();
}

/**
 * Track a page view
 */
function trackPageView(pageData) {
    console.log('Tracking page view:', pageData.page);
    
    makeRequest('POST', '/api/track/pageview', pageData, function(error, response) {
        if (error) {
            console.log('Error tracking page view:', error.message);
        } else {
            console.log('Page view tracked:', response);
        }
    });
}

/**
 * Track an event
 */
function trackEvent(eventData) {
    console.log('Tracking event:', eventData.eventName);
    
    makeRequest('POST', '/api/track/event', eventData, function(error, response) {
        if (error) {
            console.log('Error tracking event:', error.message);
        } else {
            console.log('Event tracked:', response);
        }
    });
}

/**
 * Register a user
 */
function registerUser(userData) {
    console.log('Registering user:', userData.email);
    
    makeRequest('POST', '/api/users', userData, function(error, response) {
        if (error) {
            console.log('Error registering user:', error.message);
        } else {
            console.log('User registered:', response);
        }
    });
}

/**
 * Get statistics
 */
function getStatistics(hours) {
    console.log('Fetching statistics for last', hours, 'hours');
    
    makeRequest('GET', '/stats?hours=' + hours, null, function(error, response) {
        if (error) {
            console.log('Error fetching stats:', error.message);
        } else {
            console.log('Statistics:', JSON.stringify(response, null, 2));
        }
    });
}

/**
 * Run demo tests
 */
function runDemo() {
    console.log('=====================================');
    console.log('Starting Analytics Platform Demo');
    console.log('=====================================\n');
    
    // Wait a bit to ensure server is ready
    setTimeout(function() {
        // Register users
        registerUser({
            userId: 'user_001',
            email: 'john@example.com',
            name: 'John Doe',
            metadata: { plan: 'premium' }
        });
        
        setTimeout(function() {
            registerUser({
                userId: 'user_002',
                email: 'jane@example.com',
                name: 'Jane Smith',
                metadata: { plan: 'free' }
            });
        }, 500);
        
        // Track page views
        setTimeout(function() {
            trackPageView({
                page: '/home',
                userId: 'user_001',
                sessionId: 'session_001',
                referrer: 'https://google.com'
            });
        }, 1000);
        
        setTimeout(function() {
            trackPageView({
                page: '/products',
                userId: 'user_001',
                sessionId: 'session_001'
            });
        }, 1500);
        
        setTimeout(function() {
            trackPageView({
                page: '/home',
                userId: 'user_002',
                sessionId: 'session_002'
            });
        }, 2000);
        
        setTimeout(function() {
            trackPageView({
                page: '/pricing',
                userId: 'user_002',
                sessionId: 'session_002'
            });
        }, 2500);
        
        // Track events
        setTimeout(function() {
            trackEvent({
                eventName: 'button_click',
                category: 'engagement',
                userId: 'user_001',
                sessionId: 'session_001',
                properties: {
                    buttonId: 'cta_subscribe',
                    page: '/products'
                }
            });
        }, 3000);
        
        setTimeout(function() {
            trackEvent({
                eventName: 'purchase',
                category: 'conversion',
                userId: 'user_001',
                sessionId: 'session_001',
                properties: {
                    product: 'Premium Plan',
                    amount: 99.99,
                    currency: 'USD'
                }
            });
        }, 3500);
        
        setTimeout(function() {
            trackEvent({
                eventName: 'video_play',
                category: 'engagement',
                userId: 'user_002',
                sessionId: 'session_002',
                properties: {
                    videoId: 'demo_video_001',
                    duration: 120
                }
            });
        }, 4000);
        
        // Get statistics
        setTimeout(function() {
            console.log('\n=====================================');
            getStatistics(24);
            console.log('=====================================\n');
            console.log('Demo completed!');
            console.log('Visit http://localhost:' + PORT + ' to view the dashboard');
        }, 5000);
        
    }, 1000);
}

// Run the demo
runDemo();
