const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Simulating a vulnerable blog
const comments = [];

app.use((req, res, next) => {
    // Set the flag as a cookie (Simulating Admin Session)
    // In a real scenario, an admin bot would visit, but for Level 1, 
    // we put the flag in the user's cookie so they can "steal" it from themselves via alert()
    if (!req.cookies.admin_session) {
        res.cookie('admin_session', 'FLAG{XSS_Refl3ct3d_C00k13_St34l3r}', { httpOnly: false });
    }
    next();
});

app.get('/', (req, res) => {
    const query = req.query.q || '';
    // VULNERABLE: Reflecting query parameter directly into the page
    // EJS escapes by default with <%= %>, but <%- %> outputs raw HTML
    // We will simulate a search results page
    res.render('index', { query, comments });
});

app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    if (comment) {
        comments.push(comment);
    }
    res.redirect('/');
});

app.listen(80, () => {
    console.log('XSS Challenge running on port 80');
});
