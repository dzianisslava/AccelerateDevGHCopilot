"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./auth/passport");
const index_1 = require("./routes/index");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Set the view engine to Pug
app.set('view engine', 'pug');
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
}));
// Passport initialization
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Set up routes
(0, index_1.setRoutes)(app);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
