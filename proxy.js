const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/api', createProxyMiddleware({
    target: 'https://api.panghai.top',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api'
    }
}));

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000');
}); 