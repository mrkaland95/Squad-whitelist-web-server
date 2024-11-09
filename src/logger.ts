
export enum LoggingLevel {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    CRITICAL = 4
}


/*
Basic logger, meant to very roughly correspond to the Python logging module.
 */
export class Logger {
    private readonly level: LoggingLevel;
    private readonly timestampEnabled: Boolean;
    constructor(level: LoggingLevel = LoggingLevel.INFO, timestampEnabled: Boolean = false) {
        this.level = level
        this.timestampEnabled = timestampEnabled
    }

    log(message: string, level: LoggingLevel = LoggingLevel.INFO) {
        if (level >= this.level) {
            let msg = ``
            if (this.timestampEnabled) {
                msg += `[${Date.now()}]_`
            }
            msg += `[${LoggingLevel[level]}]_${message}`
            console.log(msg)
        }
    }
}