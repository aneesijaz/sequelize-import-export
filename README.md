# sequelize-import-export

Node js module to import and export sequelize database.

## Installation

Using npm [npm](https://www.npmjs.com/package/sequelize-import-export) to install package.

```bash
npm install sequelize-import-export
```

## EXPORT DATABASE

```javascript
const sqEI = require('sequelize-import-export');
const db = require('models/index');
// create a new object and pass the sequelize model(s) in array you want to export or you can also pass an object containing the models
let dbex = new sqEI(db); // or let dbex = new sqEI([db.Product, db.Stock]);

// call the export function with the path parameter to place file.
dbex.export("/path/databaseexport.sequelize").then((path) => {
    console.log(`exported successfully to "${path}!"`);
}).catch(err => {
    console.log("got ERROR", err);
})
```


## IMPORT DATABASE

##### Note: While importing the database file make sure to place the models in correct order to avoid the contraints error. (e.g: Place Stock Model After Product Model as Stock is dependent on Product)

```javascript
const sqEI = require('sequelize-import-export');
const db = require('models/index');
// create a new object and pass the sequelize model(s) in array you want to import from the file
let dbex = new sqEI([db.Product, db.Stock]);

let options = { // optional parameter
    overwrite: true // if set to true destroyes / truncates the table and then inserts the data
}

// call the Import function with the path parameter to import and insert file in database.
dbex.import("/path/databaseexportedFile.sequelize", options).then((path) => {
    console.log(`Imported Data Successfully.`);
}).catch(err => {
    console.log("got ERROR", err);
})
```


## Working
Totally Based on sequelize syntax and no native dumps. Just iterates over the provided models and uses findAll method to get all the models.
And to import data it uses the upsert query.
##### Note: The larger the database is the more time will it take.


#### The Module is tested with Sequelize's (@5.8.6 version) sqllite and mysql adapter. Use it at your own risk. The author is not responsible for your data loss.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Support

Follow me to show your support.
[Facebook](https://www.facebook.com/lafanggaparinda)
[Twitter](https://twitter.com/billdarwaza)
[Fasterbyte](https://fasterbyte.net)
[Instagram](https://www.instagram.com/teacher_of_teachers)
