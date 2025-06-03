const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Root endpoint hit!');
    res.json({ message: 'Test server is working!' });
});

app.get('/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Test endpoint working!' });
});

app.listen(3000, () => {
    console.log('Test server running on http://localhost:3000');
});
