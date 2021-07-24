"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACEBOOK_DEV = exports.DATABASE_SERVER_CONFIG_DEV = void 0;
require('dotenv').config();
var DATABASE_SERVER_CONFIG_DEV = {
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DB,
    port: Number(process.env.PORT_DB),
    server: process.env.SERVER_DB,
};
exports.DATABASE_SERVER_CONFIG_DEV = DATABASE_SERVER_CONFIG_DEV;
var FACEBOOK_DEV = {
    VALIDATION_TOKEN: 'TokenTuyChon',
    PAGE_ACCESS_TOKEN: 'EAAVvoN2edJABAJEqQ585UC7FDga1Ku02jazR2ZBvcY3TPnmTQYG88jSp4XD2PABoaOO2znzfoZACCpq06YMJJ7CKT7rLQE79Khhkbww6tw8x6nig6TfZB9I59CU2YSpgwxzvYsiOlNbeTcZBUGvfMBZBXOMUWYJ808POUfYBUhwZDZD',
    ADMIN_MESSENGER_ID: '3119991678020925',
};
exports.FACEBOOK_DEV = FACEBOOK_DEV;
