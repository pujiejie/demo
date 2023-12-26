const fs = require('fs/promises');
const path = require("path");

module.exports = async function(type) {
    let data = await fs.readFile(path.resolve('type.json'));
    data = JSON.parse(data);
    return data[type];
}