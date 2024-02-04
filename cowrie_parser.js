const fs = require('fs');
const path = require('path');

const searchString = 'cowrie.json';

const directoryPath = './';

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Error reading directory: ' + err);
    }

    files.forEach((file) => {
        if (file.includes(searchString)) {
            fs.readFile(path.join(directoryPath, file), 'utf8', (err, data) => {
                if (err) {
                    console.log('Error reading file: ' + err);
                } else {
                    let lines = data.split('\n');

                    for (let i = 0; i < lines.length - 2; i++) {
                        lines[i] = lines[i] + ',';
                    }

                    let modifiedData = lines.join('\n');

                    modifiedData = "{\"array\": [" + modifiedData + "]}";

                    fs.writeFile(path.join(directoryPath, file), modifiedData, 'utf8', (err) => {
                        if (err) {
                            console.log('Error writing to file: ' + err);
                        } else {
                            console.log(`Changes in file ${file} were written.`);
                        }
                    });
                }
            });
        }

    });
});
