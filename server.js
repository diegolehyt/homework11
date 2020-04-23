// ==========================================================================================================================================
// =================================================\ Note Taker - Homework 11 /=============================================================
// ==========================================================================================================================================

// -------------------------------------------------------\ Porject Const /------------------------------------------------------------------

// IN
const path = require('path');
const fs = require('fs');

// Express
const express = require('express');
const app = express();

// PORT
const PORT = process.env.PORT || 7000;

// Save Notes folder
let savedN = require('./db/db.json');

// app
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Path
const output_dir = path.resolve(__dirname, "public");

// Generate ID
let ID = function () {
    return Math.random().toString(36).substr(2, 9);
};

// Write notes
function writeN() {
    fs.writeFileSync('db/db.json', JSON.stringify(savedN), function (err) {
        if (err) {
            return err;
        }

    });
};

// ----------------------------------------------------------\ app Routes /--------------------------------------------------------------------

//   ----------------\ Pages /------------------
// Homepage
app.get('/', function (req, res) {
    res.sendFile(path.join(output_dir, 'index.html'));
});

// Notes page
app.get('/notes', function (req, res) {
    res.sendFile(path.join(output_dir, 'notes.html'));
});

//  --------------\ Notes /-----------------
// Displays notes
app.get('/api/notes', function (req, res) {
    return res.json(savedN);
});

// Post notes
app.post('/api/notes', function (req, res) {
    let note = req.body;

    // id Creator
    note.id = ID();
    // console.log(note.id);  // =================== Print command-line, ID check
    
    // push note
    savedN.push(note);

    //  writes new notes
    writeN();

    return res.json(savedN);
});

// Deletes notes
app.delete("/api/notes/:id", function (req, res) {
    // ID
    let id = req.params.id;
    
    // Loop saved notes array
    for (let i = 0; i < savedN.length; i++) {
        if (savedN[i].id === id) {

            // Delete one note from array
            savedN.splice(i, 1);

            // Overwrite
            writeN();
            return res.json(savedN);
        }
    };
});

// ------------------------------------------------------\ PORT Listener /--------------------------------------------------------------------
app.listen(PORT, function () {
    console.log('Listening at PORT:' + PORT);
});

// ==========================================================================================================================================
// ===========================================================\ END /========================================================================
// ==========================================================================================================================================