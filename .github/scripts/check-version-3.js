const packageJson = require('./package.json');
const PACKAGE_NAME = 'ricos-schema';
const TARGET_VERSION = packageJson.version;

const TIMEOUT_MINUTES = 30;
const CHECK_INTERVAL = 60 * 1000; // 60 seconds

const checkPackage = () => {
  fetch('https://static.parastorage.com/unpkg/'+ PACKAGE_NAME+ '@' + TARGET_VERSION)
    .then(response => {
      if (response.ok) {
        console.log('Package with the given version exists!');
        return true;
      }
    })
    .catch(() => {
      console.log('Target version: '+TARGET_VERSION+' not found');
      return false;
    });
};

const main = async () => {
  const endTime = Date.now() + TIMEOUT_MINUTES * 60 * 1000;

  while (Date.now() < endTime) {
    try {
      const isPublished = await checkPackage();
      if (isPublished) {
        console.log(`Package ${PACKAGE_NAME} is published.`);
        process.exit(0);
      } else {
        console.log(`Package ${PACKAGE_NAME} is not published yet.`);
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  console.log(`Timeout reached. Package ${PACKAGE_NAME} is not published.`);
  process.exit(1);
};

await main();