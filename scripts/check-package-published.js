/* eslint-disable no-console */
async function checkPackagePublished(exec, targetPackage, timeoutMinutes) {
  const CHECK_INTERVAL = 60 * 1000; // 60 seconds
  const endTime = Date.now() + timeoutMinutes * 60 * 1000;

  console.log(`Checking whether ${targetPackage} is published.`);

  const validatePackageIsPublished = async () => {
    try {
      await exec('npm', ['info', targetPackage, '--registry=https://npm.dev.wixpress.com']);
      console.log('Package is published.');
      return true;
    } catch (e) {
      console.log('Package is not published yet. Retrying in 1 minute.');
      console.log(e.message);
      return false;
    }
  };

  while (Date.now() < endTime) {
    const isPublished = await validatePackageIsPublished();
    if (isPublished) {
      process.exit(0);
    } else {
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }

  console.log(`Timeout reached. Package ${targetPackage} is not published.`);
  process.exit(1);
}

module.exports = { checkPackagePublished };
