async function checkPackageVersion() {
  const packageJson = require('./package.json');
  const packageName = 'ricos-schema'; // Replace with your package name
  const targetVersion = packageJson.version;

  const maxAttempts = 5;
  let attempt = 0;
  let versionsExists = false;

  while (attempt < maxAttempts || !versionsExists) {
    console.log(`Attempt ${attempt + 1}: Checking ${packageName} version...`);

    fetch('https://static.parastorage.com/unpkg/ricos-schema@' + targetVersion)
      .then(response => {
        if (response.ok) {
          versionsExists = true;
          console.log('Package with the given version exists!');
        }
      })
      .catch(() => {
        console.log(`Target version: ${targetVersion} not found. Retrying in 1 minute...`);
        attempt++;
      });

    await new Promise(resolve => setTimeout(resolve, 60000));
  }

  if (versionsExists) {
    console.log(`Found package ${packageName}@${targetVersion} after ${attempt + 1} attempts.`);
    return true;
  }

  console.error(
    `Failed to find package ${packageName}@${targetVersion} after ${maxAttempts} attempts.`
  );

  return false;
}

module.exports = checkPackageVersion;
