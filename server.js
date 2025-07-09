const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create messages directory if it doesn't exist
const messagesDir = path.join(__dirname, 'messages');
fs.mkdir(messagesDir, { recursive: true }).catch(console.error);

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:5500']
}));
app.use(express.json());
app.use(express.static('.'));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many contact form submissions, please try again later.'
    }
});

// Function to save message to local file
async function saveMessageToFile(name, email, message) {
    const timestamp = new Date().toISOString();
    const messageData = {
        timestamp: timestamp,
        name: name,
        email: email,
        message: message,
        id: Date.now().toString()
    };

    // Save individual message file
    const filename = `message_${Date.now()}.json`;
    const filepath = path.join(messagesDir, filename);
    
    try {
        await fs.writeFile(filepath, JSON.stringify(messageData, null, 2));
        
        // Also append to a master log file
        const logEntry = `
=== NEW PORTFOLIO MESSAGE ===
Date: ${new Date(timestamp).toLocaleString()}
Name: ${name}
Email: ${email}
Message: ${message}
================================

`;
        
        const logFile = path.join(messagesDir, 'contact_log.txt');
        await fs.appendFile(logFile, logEntry);
        
        // Console log for immediate viewing
        console.log('📧 NEW CONTACT FORM SUBMISSION:');
        console.log(`📅 Date: ${new Date(timestamp).toLocaleString()}`);
        console.log(`👤 Name: ${name}`);
        console.log(`📧 Email: ${email}`);
        console.log(`💬 Message: ${message}`);
        console.log(`💾 Saved to: ${filename}`);
        console.log('---');
        
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email address'
            });
        }

        // Save message to local file system
        const saved = await saveMessageToFile(name, email, message);
        
        if (saved) {
            console.log(`✅ New contact form submission from ${name} (${email})`);
            
            res.json({
                success: true,
                message: 'Message received successfully! I\'ll get back to you soon.'
            });
        } else {
            throw new Error('Failed to save message');
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again later.'
        });
    }
});

// Get all messages endpoint (for you to view messages)
app.get('/api/messages', async (req, res) => {
    try {
        const files = await fs.readdir(messagesDir);
        const messageFiles = files.filter(file => file.startsWith('message_') && file.endsWith('.json'));
        
        const messages = [];
        for (const file of messageFiles) {
            try {
                const content = await fs.readFile(path.join(messagesDir, file), 'utf8');
                const messageData = JSON.parse(content);
                messages.push(messageData);
            } catch (error) {
                console.error(`Error reading message file ${file}:`, error);
            }
        }
        
        // Sort by timestamp (newest first)
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.json({ success: true, messages, count: messages.length });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Delete message endpoint
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const files = await fs.readdir(messagesDir);
        const targetFile = files.find(file => file.includes(id));
        
        if (targetFile) {
            await fs.unlink(path.join(messagesDir, targetFile));
            res.json({ success: true, message: 'Message deleted' });
        } else {
            res.status(404).json({ success: false, error: 'Message not found' });
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, error: 'Failed to delete message' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date().toISOString(),
        storage: 'local-files',
        messagesDir: messagesDir
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🤖 Cyberpunk Portfolio Server running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});
