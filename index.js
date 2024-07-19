const fs = require('fs');
const path = require('path');
const Typo = require('typo-js');

// Create a new Typo instance with the English dictionary
const dictionary = new Typo("en_US");

// Function to check for typos in a text
function checkTypos(text) {
    const words = text.split(/\s+/);
    const typos = words.filter(word => !dictionary.check(word));
    return typos;
}

// Function to check a single file
function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const typos = checkTypos(content);
    if (typos.length > 0) {
        console.log(`Typos found in ${filePath}: ${typos.join(', ')}`);
    } else {
        console.log(`No typos found in ${filePath}.`);
    }
}

// Function to check all text files in a directory
function checkDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Unable to scan directory: ${err}`);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isFile() && filePath.endsWith('.txt')) {
                checkFile(filePath);
            }
        });
    });
}

// Main function to handle CLI arguments
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Please provide a file or directory path.');
        return;
    }

    const inputPath = args[0];
    if (fs.existsSync(inputPath)) {
        if (fs.statSync(inputPath).isFile()) {
            checkFile(inputPath);
        } else if (fs.statSync(inputPath).isDirectory()) {
            checkDirectory(inputPath);
        }
    } else {
        console.log('The specified path does not exist.');
    }
}

main();