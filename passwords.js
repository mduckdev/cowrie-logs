const fs = require('fs').promises;
const path = require('path');

let passwordsMap = new Map();
let usernamePasswordMap = new Map();
const searchString = 'cowrie.json';

const directoryPath = './';
async function processFile(file) {
    if (file.includes(searchString)) {
        const data = await fs.readFile(path.join(directoryPath, file), 'utf8');
        const JSONdata = JSON.parse(data);
        let cowrieArray = JSONdata.array;
        cowrieArray.forEach(event => {
            if (event.eventid == "cowrie.login.failed") {
                let isFound = passwordsMap.get(event.password);
                let isFoundUsernamePassword = usernamePasswordMap.get(JSON.stringify({ "username": event.username, "password": event.password }));
                if (isFound) {
                    passwordsMap.set(event.password, isFound + 1);
                } else {
                    passwordsMap.set(event.password, 1)
                }
                if (isFoundUsernamePassword) {
                    usernamePasswordMap.set(JSON.stringify({ "username": event.username, "password": event.password }), isFoundUsernamePassword + 1);
                } else {
                    usernamePasswordMap.set(JSON.stringify({ "username": event.username, "password": event.password }), 1);
                }
            }
        });
    }
}

async function processFiles() {
    try {
        const files = await fs.readdir(directoryPath);
        await Promise.all(files.map(file => processFile(file)));
        const sortedpasswordsMap = [...passwordsMap.entries()].sort((a, b) => b[1] - a[1]);
        const sortedArrayJson = sortedpasswordsMap.map(([key, value]) => ({ "password": key, "count": value }));
        const sortedArrayTxt = sortedpasswordsMap.map(([key, value]) => `${key} ${value}`).join("\n");
        const sortedArrayTxtWithoutCount = sortedpasswordsMap.map(([key, value]) => `${key}`).join("\n");

        const sortedUsernamePasswordsMap = [...usernamePasswordMap.entries()].sort((a, b) => b[1] - a[1]);
        const sortedUsernamePasswordArrayJson = sortedUsernamePasswordsMap.map(([key, value]) => ({ "username": JSON.parse(key).username, "password": JSON.parse(key).password, "count": value }));
        const sortedUsernamePasswordArrayTxt = sortedUsernamePasswordsMap.map(([key, value]) => `${JSON.parse(key).username}:${JSON.parse(key).password} ${value}`).join("\n");
        const sortedusernamePasswordArrayTxtWithoutCount = sortedUsernamePasswordsMap.map(([key, value]) => `${JSON.parse(key).username}:${JSON.parse(key).password}`).join("\n");


        fs.writeFile("./passwords/passwords_with_count.json", JSON.stringify(sortedArrayJson));
        fs.writeFile("./passwords/passwords_with_count.txt", sortedArrayTxt)
        fs.writeFile("./passwords/passwords.txt", sortedArrayTxtWithoutCount)

        fs.writeFile("./usernames_passwords/usernames_passwords_with_count.json", JSON.stringify(sortedUsernamePasswordArrayJson));
        fs.writeFile("./usernames_passwords/usernames_passwords_with_count.txt", sortedUsernamePasswordArrayTxt)
        fs.writeFile("./usernames_passwords/usernames_passwords.txt", sortedusernamePasswordArrayTxtWithoutCount)

    } catch (err) {
        console.log('Error: ' + err);
    }
}

processFiles();
