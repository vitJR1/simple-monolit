import {DataSource} from "typeorm";
import express from "express";

export const addDataSourceToRequest = (source: DataSource) =>
    (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    req.dataSource = source
    next()
}