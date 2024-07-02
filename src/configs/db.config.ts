import mongoose from "mongoose";
import { config } from "./config";
import bunyan from "bunyan";

const log = bunyan.createLogger({ name: "db-config" });

export const connectDB = async () => {
  mongoose
    .connect(config.dbUrl, { connectTimeoutMS: 10000 })
    .then((res) => {
      log.info("connected");
    })
    .catch((err) => {
      log.error(err);
    });
};
