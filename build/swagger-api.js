"use strict";
var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HomNayDocGi API with Swagger',
            version: '0.1.0',
            description: 'This is documenting api',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Tabn.dev',
                url: 'https://homnaydocgi-client-2-iogc8.ondigitalocean.app/',
                email: 'taibn.dev@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./routes/books.js'],
};
exports.apidocs = options;
