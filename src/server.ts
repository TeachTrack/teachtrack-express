import Logger from "bunyan";
import app from "./app";
import { config } from "./configs/config";
import bunyan from "bunyan";

const log: Logger = bunyan.createLogger({ name: "server" });

app.listen(config.port, () => {
  log.info(`Server is running on port ${config.port}`);
});
