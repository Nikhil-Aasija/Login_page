// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

// Route to serve the signup form
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    });
});

// Route to handle form submission
app.post('/signup', (req, res) => {
    let body = '';

    // Collect the data chunks
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // Handle the complete request
    req.on('end', () => {
        // Parse the data (manual parsing)
        const params = new URLSearchParams(body);
        const username = params.get('username');
        const email = params.get('email');
        const password = params.get('password');

        // Create a string to save in the file
        const userData = `Username: ${username}, Email: ${email}, Password: ${password}\n`;

        // Append the data to a file
        fs.appendFile('information.txt', userData, (err) => {
            if (err) throw err;
            console.log('User data saved!');
        });

        // Send a response back to the client
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Signup successful! Your data has been saved.');
        res.end();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
