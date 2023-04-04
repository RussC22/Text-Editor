import { openDB } from "idb";

const initdb = async () =>
  // We are creating a new database named 'contact' which will be using version 1 of the database.
  openDB("jate", 1, {
    // Add our database schema if it has not already been initialized.
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // Create a new object store for the data and give it an key name of 'id' which needs to increment automatically.
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// Export a function we will use to POST to the database.
export const postDb = async (content) => {
  console.log("Put to the database");

  // Create a connection to the database database and version we want to use.
  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction("jate", "readwrite");

  // Open up the desired object store.
  const store = tx.objectStore("jate");

  // Use the .add() method on the store and pass in the content.
  const request = store.put({ id: 1, value: content });
  const result = await request;
  console.log("🚀 - data saved to the database", result.value);
};

export const getDb = async () => {
  console.log("GET from the database");
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  const request = store.get(1);
  const result = await request;
  result
    ? console.log("🚀 - data retrieved from the database", result.value)
    : console.log("🚀 - data not found in the database");
  return result?.value;
};
// Start the database
initdb();
