import { getClient } from '../app/(api)/_utils/mongodb/mongoClient.mjs';
import readline from 'readline';
import generateData from './generateData.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function dbSeed(collectionNames, numDocuments, wipe) {
  try {
    const client = await getClient();
    const db = client.db();

    const schema = await db.listCollections().toArray();
    const schemaKeys = [];
    for (const collection of schema) {
      schemaKeys.push(collection.name);
    }
    schemaKeys.push('admin');

    for (const collectionName of collectionNames.split(' ')) {
      if (schemaKeys.find((key) => key === collectionName) === undefined) {
        console.log(`Collection ${collectionName} not found.`);
        continue;
      }

      const collection = db.collection(
        collectionName === 'admin' ? 'users' : collectionName
      );

      if (wipe === 'y') {
        await collection.deleteMany({});
        console.log(`Wiped collection: ${collectionName}`);
      }

      const fakeData = generateData(collectionName, numDocuments);
      const result = await collection.insertMany(fakeData);
      console.log(
        `${result.insertedCount} documents inserted into ${collectionName}`
      );
    }

    await client.close();
  } catch (error) {
    console.log(error);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function gatherInput() {
  try {
    const collectionNames = await askQuestion(
      'Which collection(s) would you like to generate data for? List their names (case-sensitive) separated by spaces: '
    );

    const numDocumentsStr = await askQuestion(
      'How many documents would you like to generate (admin generates only one document regardless)? Enter a number: '
    );
    const numDocuments = parseInt(numDocumentsStr);

    let wipe = '';
    while (wipe !== 'y' && wipe !== 'n') {
      wipe = (
        await askQuestion(
          'Would you like to wipe the collections before seeding? (y/n): '
        )
      ).toLowerCase();
      if (wipe !== 'y' && wipe !== 'n') {
        console.log('Please enter either "y" or "n".');
      }
    }

    rl.close();

    return { collectionNames, numDocuments, wipe };
  } catch (error) {
    console.error(error);
    rl.close();
  }
}

gatherInput()
  .then(({ collectionNames, numDocuments, wipe }) => {
    console.log('\n');
    console.log('Inputs gathered:');
    console.log('Collection Names:', collectionNames);
    console.log('Number of Documents:', numDocuments);
    console.log('Wipe Collections:', wipe);
    console.log('\n');

    dbSeed(collectionNames, numDocuments, wipe);
  })
  .catch((error) => {
    console.error('Error in gatherInput:', error);
  });
