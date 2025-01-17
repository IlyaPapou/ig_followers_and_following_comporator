const fs = require('fs').promises;

const FILE_1_PATH = './followers_1.json';
const FILE_2_PATH = './following.json';
const OUTPUT_FILE_PATH = 'output.json';

/**
 * Load and parse JSON data from a given filepath.
 * @param {string} filepath
 * @returns {Object}
 */
async function loadJSONData(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading or parsing file ${filepath}: ${error.message}`);
    }
}

/**
 * Extract values from the first file structure.
 * @param {Object} data
 * @returns {Set}
 */
function extractValuesFromFirstFile(data) {
    const valuesSet = new Set();
    (data || []).forEach(item => {
        (item.string_list_data || []).forEach(dataItem => {
            valuesSet.add(dataItem.value);
        });
    });
    return valuesSet;
}

/**
 * Extract values from the second file structure that are not present in the provided set.
 * @param {Object} data
 * @param {Set} comparisonSet
 * @returns {Array}
 */
function extractExclusiveValues(data, comparisonSet) {
    const exclusiveValues = [];
    (data.relationships_following || []).forEach(item => {
        (item.string_list_data || []).forEach(dataItem => {
            if (!comparisonSet.has(dataItem.value)) {
                exclusiveValues.push(dataItem.value);
            }
        });
    });
    return exclusiveValues;
}

/**
 * Save data to a given filepath.
 * @param {string} filepath
 * @param {Object} data
 */
async function saveToFile(filepath, data) {
    try {
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw new Error(`Error writing to file ${filepath}: ${error.message}`);
    }
}

/**
 * Main process function.
 */
async function mainProcess() {
    try {
        const firstJSONData = await loadJSONData(FILE_1_PATH);
        const secondJSONData = await loadJSONData(FILE_2_PATH);

        const firstValuesSet = extractValuesFromFirstFile(firstJSONData);
        const exclusiveValues = extractExclusiveValues(secondJSONData, firstValuesSet);

        await saveToFile(OUTPUT_FILE_PATH, exclusiveValues);
        console.log('Process completed successfully.');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

console.time('Main Process Execution Time');

mainProcess();

console.timeEnd('Main Process Execution Time');