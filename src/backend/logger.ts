
/*
Logging levels, any set level also outputs the logs from any level above itself.
 */
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

    debug(message: string) {
        if (this.level >= LoggingLevel.DEBUG) {
            const output = this.constructMsg(message, LoggingLevel.DEBUG)
            console.log(output)
        }
    }

    info(message: string) {
        if (this.level >= LoggingLevel.INFO) {
            const output = this.constructMsg(message, LoggingLevel.INFO)
            console.log(output)
        }
    }

    warning(message: string) {
        if (this.level >= LoggingLevel.WARNING) {
            const output = this.constructMsg(message, LoggingLevel.WARNING)
            console.warn(output)
        }
    }

    critical(message: string) {
        if (this.level >= LoggingLevel.CRITICAL) {
            const output = this.constructMsg(message, LoggingLevel.CRITICAL)
            console.warn(output)
        }
    }

    error(message: string) {
        if (this.level >= LoggingLevel.ERROR) {
            const output = this.constructMsg(message, LoggingLevel.CRITICAL)
            console.error(output)
        }
    }

    constructMsg(message: string, level: LoggingLevel) {
        let msg = ``
        if (this.timestampEnabled) {
            msg += `[${Date.now()}]_`
        }
        msg += `[${LoggingLevel[level]}]_[${message}]`
        return msg
    }
}