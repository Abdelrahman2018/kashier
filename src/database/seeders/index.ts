import PromiseBlueBird from "bluebird";
import sequelizeLoader, { sequelizeLoaderRes } from "../../loaders/sequelize";


const forceSeed = async () => {
  try {
    console.log("Trying to connect to database...");

    const { sequelize, models } =
      (await sequelizeLoader()) as sequelizeLoaderRes;
    console.log("Connected to Databse successully!");

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    console.log("Start syncing...");
    await sequelize.sync({ force: true });

    console.log("Start seeding...");
    console.log("-----------------------------------------");

    /**
     * generate countries
     */
    //  await PromiseBlueBird.all(
    //   countries.map((country) => {
    //     const countryObject = {
    //         name: country["name"]["common"]
    //     }
    //      return models?.Country.create(countryObject);
    //     })
    // );

    // console.log("✔ Countries populated");

    

    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

forceSeed();