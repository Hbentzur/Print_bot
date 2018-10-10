console.log('Working');

//const PDF_OR_PRINT = false;

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Jimp to distort the image
const Jimp = require('jimp');

// Prince to generate a pdf
const prince = require("prince");

// tracery
const tracery = require('tracery-grammar');


// The printing command
const paper = 'lp -o fit-to-page -o media=Letter -o position=left -d _172_22_151_102 ./fin.jpg';
//const cmd = 'pwd';

// Start once
printer();


// Repeat every minute
//setInterval(printer, 10000);


function printer() {
    print()
        .then(response => console.log(response))
        .catch(error => console.log(error));
}

async function print() {

    var grammar = tracery.createGrammar({
        'birds': ['- - -', '- - --    - - -', '- - -- - -- -  -- - -', '- - -- -  -- - -'],
        'lots': ['||| | | | ||| | | .... ||| . ||', '||| . . || . | .', '|||||||', '|       |. . . .||'],
        'origin': ['THERE ARE #lots# OF #birds# IN THE SKY SUDDENLY'],
    });

    grammar.addModifiers(tracery.baseEngModifiers);

    const fintxt = grammar.flatten('#origin#');

    // Step 1: distort pic
    const pic = await Jimp.read('fin.jpg');
    await pic.blur(5);
    await pic.pixelate(3);
    await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => { pic.print(font, 120, 80, fintxt); });
    await pic.write('fin.jpg');

    // PDF
    const response1 = await prince().inputs('./index.html').output(Date.now() + "test.pdf").execute();
    console.log('here');

    // Print
    exec(paper);
    return response1;
}

