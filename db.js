import { openDatabase } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseCategories } from "./constants/data";
import Category from "./models/Category";
import Commitment from "./models/Commitment";

const db = openDatabase("iWatch.db");

new Promise((resolve, reject) => {
  db.transaction((tx) => {
    tx.executeSql(
      "PRAGMA foreign_keys = ON",
      [],
      () => {
        resolve("Foreign Keys Enabled");
      },
      () => {
        reject("Foreign keys not enabled.");
      }
    );
  });
}); // .then((res) => console.log(res));

export const createTables = async () => {
  const categoriesPromise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        ` CREATE TABLE IF NOT EXISTS categories
        (id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE CHECK(length(name) > 0),
        colorCode TEXT NOT NULL DEFAULT '#000000',
        img NUMERIC
        );
        `,
        [],
        () => {
          // console.log("Categories table initialized.");
          resolve();
        },
        () => {
          reject("Database initialization failed.");
        }
      );
    });
  });

  const commitmentsPromise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        ` CREATE TABLE IF NOT EXISTS commitments
        (id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL CHECK(length(name) > 0),
        imgUri NUMERIC,
        imgLocal INTEGER NOT NULL DEFAULT '0',
        totalEpisodes INTEGER NOT NULL,
        currentEpisode INTEGER NOT NULL DEFAULT '0',
        description TEXT,
        category INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'yet to watch',
        type TEXT NOT NULL DEFAULT 'multi-episode',
        FOREIGN KEY (category) REFERENCES categories(id)
        )`,
        [],
        () => {
          // console.log("Commitments table initialized.");
          resolve();
        },
        () => {
          reject("Database initialization failed.");
        }
      );
    });
  });

  return Promise.all([categoriesPromise, commitmentsPromise]);
};

export const init = async () => {
  AsyncStorage.removeItem("DatabaseNotUpdated");
  if ((await AsyncStorage.getItem("DatabaseUpdated")) == "true") {
    await createTables();
    await initializeBaseCategories();
  } else {
    const categories = await getAll("categories");
    const commitments = await getAll("commitments");

    await reset();
    await createTables();

    for (const { name, colorCode, img } of categories) {
      addOne(new Category(name, colorCode, img));
    }
    for (const {
      name,
      imgUri,
      imgLocal,
      totalEpisodes,
      currentEpisode,
      category,
      description,
      status,
      type,
    } of commitments) {
      addOne(
        new Commitment(
          name,
          imgUri,
          imgLocal,
          totalEpisodes,
          currentEpisode,
          category,
          description,
          status,
          type
        )
      );
    }

    await AsyncStorage.setItem("DatabaseUpdated", "true");
  }
};

export const initializeBaseCategories = async () => {
  // console.log("Initializing base categories");
  if (!(await AsyncStorage.getItem("initialized"))) {
    for (const category of baseCategories) {
      try {
        await addOne(category);
      } catch (error) {
        console.log(`DB Error: ${error}`);
      }
    }
    await AsyncStorage.setItem("initialized", "true");
  }
  // console.log("Base categories initialized");
};

export const getAll = (table) => {
  return new Promise((resolve, reject) => {
    if (table !== "categories" && table !== "commitments") {
      reject(
        "Table argument must be either categories or commitments. Supplied: " +
          table
      );
    }

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${table}`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log(error);
          reject(`Fetching all entries from ${table} failed`);
        }
      );
    });
  });
};

export const getOne = (table, id) => {
  return new Promise((resolve, reject) => {
    if (table !== "categories" && table !== "commitments") {
      reject(
        "Table argument must be either categories or commitments. Supplied: " +
          table
      );
    }

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${table} WHERE id = ${id}`,
        [],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        () => {
          reject(`No entry with such id (${id}) in ${table}`);
        }
      );
    });
  });
};

export const addOne = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.constructor.name !== "Category" &&
      data.constructor.name !== "Commitment"
    ) {
      reject(
        "Supplied data must be of type Category or Commitment. Got of type: " +
          data.constructor.name
      );
    }

    if (data.constructor.name == "Category") {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO categories (name, colorCode, img) VALUES (?, ?, ?)`,
          [data.name, data.colorCode, data.img],
          () => {
            resolve();
          },
          (_, error) => {
            console.log(`DB Error: ${error}`);
            reject(`Cannot insert values in categories table`);
          }
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO commitments (name, imgUri, imgLocal, totalEpisodes, currentEpisode, category, description, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.name,
            data.imgUri,
            data.imgLocal,
            data.totalEpisodes,
            data.currentEpisode,
            data.category,
            data.description,
            data.status,
            data.type,
          ],
          (_, result) => {
            resolve(result.rows._array[0]);
          },
          (_, error) => {
            console.log(`DB Error: ${error}`);
            reject(`Cannot insert values in commitments table`);
          }
        );
      });
    }
  });
};

export const deleteOne = (table, id) => {
  return new Promise((resolve, reject) => {
    if (table !== "categories" && table !== "commitments") {
      reject(
        "Table argument must be either categories or commitments. Supplied: " +
          table
      );
    }

    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${table} WHERE id = ${id}`,
        [],
        () => {
          resolve();
        },
        () => {
          reject(`No entry with such id (${id}) in ${table}`);
        }
      );
    });
  });
};

export const updateOne = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.constructor.name !== "Category" &&
      data.constructor.name !== "Commitment"
    ) {
      reject(
        "Supplied data must be of type Category or Commitment. Got of type: " +
          data.constructor.name
      );
    }

    if (data.constructor.name == "Category") {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE categories SET name = ?, colorCode = ?, img = ? WHERE id = ${data.id}`,
          [data.name, data.colorCode, data.img],
          () => {
            resolve();
          },
          () => {
            reject(`Cannot update values in categories table`);
          }
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE commitments SET name = ?, imgUri = ?, imgLocal = ?, totalEpisodes = ?, currentEpisode = ?, category = ?, description = ?, status = ?, type = ? WHERE id = ${data.id}`,
          [
            data.name,
            data.imgUri,
            data.imgLocal,
            data.totalEpisodes,
            data.currentEpisode,
            data.category,
            data.description,
            data.status,
            data.type,
          ],
          () => {
            resolve();
          },
          () => {
            reject(`Cannot update values in commitments table`);
          }
        );
      });
    }
  });
};

export const reset = async () => {
  // const categoriesDeletePromise = await new Promise((resolve, reject) => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       `DELETE FROM categories`,
  //       [],
  //       () => {
  //         console.log("Categories table emptied.");
  //         resolve();
  //       },
  //       () => {
  //         reject("Database emptying failed.");
  //       }
  //     );
  //   });
  // });

  // const commitmentsDeletePromise = await new Promise((resolve, reject) => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       `DELETE FROM commitments`,
  //       [],
  //       () => {
  //         console.log("Commitments table emptied.");
  //         resolve();
  //       },
  //       () => {
  //         reject("Database emptying failed.");
  //       }
  //     );
  //   });
  // });

  const categoriesDropPromise = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS categories`,
        [],
        (_, result) => {
          console.log("Categories table dropped.");
          resolve();
        },
        () => {
          reject("Database dropping failed.");
        }
      );
    });
  });

  const commitmentsDropPromise = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS commitments`,
        [],
        () => {
          console.log("Commitments table dropped.");
          resolve();
        },
        () => {
          reject("Database dropping failed.");
        }
      );
    });
  });

  await AsyncStorage.removeItem("initialized");

  return Promise.all([
    // categoriesDeletePromise,
    // commitmentsDeletePromise,
    categoriesDropPromise,
    commitmentsDropPromise,
  ]);
};
