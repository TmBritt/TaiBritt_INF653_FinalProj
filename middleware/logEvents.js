const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Function to log events with timestamp, unique identifier, and message to a file
async function logEvents(message, logName) {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // Check if the logs directory exists, if not, create it
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }

        // Construct the path for the log file
        const logFilePath = path.join(logsDir, logName);

        // Append log item to the log file
        await fsPromises.appendFile(logFilePath, logItem);
    } catch (err) {
        // Log any errors encountered during file operations
        console.error(err);
    }
}

// Middleware function to log incoming requests
const logger = (req, res, next) => {
    // Log request method, origin, and URL using logEvents function
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');

    // Log request method and path to console
    console.log(`${req.method} ${req.path}`);

    // Move to the next middleware function
    next();
};

module.exports = { logger, logEvents };
