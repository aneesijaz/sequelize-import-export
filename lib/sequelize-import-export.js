"use strict";

const fs = require("fs");


class SequelizeIE {
    constructor(models = []) {
        this._models = [];
        for (let m in models) {
            if (models[m] && models[m].build) {
                let m_ = models[m].build();
                if (models[m].name && models[m].name.length) {
                    this._models[models[m].name] = models[m];
                }
            }

        }

        this.import = this.import.bind(this);
        this.export = this.export.bind(this);
    }

    import(dir, options = { overwrite: false }) {
        if (!dir)
            throw new Error("Please Specify a Directory to place the export file");
        return new Promise((resolve, reject) => {
            let dataModels = [];
            let tryAgainQue = [];
            try {

                fs.readFile(dir, (err, data) => {
                    if (err) reject(err);
                    // parse the content
                    dataModels = JSON.parse(data.toString());

                    (async () => {
                        for (let m in this._models) {
                            let tmpModel = dataModels.find(mod => mod.modelName == m);
                            if (tmpModel) {
                                if (options.overwrite) {
                                    await this._models[m].destroy({ where: {}, truncate: true });
                                }

                                // insert the data
                                tmpModel.data.map(async (row) => {
                                    try {
                                        await this._models[m].upsert(row)
                                    } catch (err) {
                                        reject(err);
                                    }
                                });
                            }
                        }
                        resolve();
                    })();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    export(dir) {
        if (!dir)
            throw new Error("Please Specify a Directory to place the export file");

        return new Promise((resolve, reject) => {
            try {
                (async () => {
                    let exportData = [];
                    for (let m in this._models) {
                        let tmpData = await this._models[m].findAll({ paranoid: false });
                        if (tmpData) {
                            tmpData = JSON.parse(JSON.stringify(tmpData));
                        }
                        let tmpobj = {
                            modelName: m,
                            data: tmpData || []
                        }

                        exportData.push(tmpobj);
                    }

                    // place the file in the dir
                    fs.writeFile(dir, JSON.stringify(exportData), (err) => {
                        if (err) reject(err)
                        else
                            resolve(dir);
                    })
                })();
            } catch (err) {
                reject(err);
            }
        });
    }

}

module.exports = SequelizeIE;