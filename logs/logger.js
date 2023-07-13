import { createLogger, transports, format } from "winston";

const tableUploadLogger = createLogger({
  format: format.json(),
  transports: [
    new transports.File({ filename: "logs/tableUpload.log" }),
    new transports.File({
      filename: "logs/tableUploadError.log",
      level: "error"
    })
  ]
});

export { tableUploadLogger };
