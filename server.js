const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// app.use (function (req, res, next) {
//   if (req.secure) {
//           // request was via https, so do no special handling
//           next();
//   } else {
//           // request was via http, so redirect to https
//           res.redirect('https://' + req.headers.host + req.url);
//   }
// });

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
  console.log("here")
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});