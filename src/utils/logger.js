import winston from "winston";

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

export const logger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
    }),
  ],
});


export const addLogger = (req,res,next) => {
  req.logger = logger
  req.logger.http(`[${req?.method}] - ${req?.url} ${new Date().toLocaleTimeString()}`)

  next()
}