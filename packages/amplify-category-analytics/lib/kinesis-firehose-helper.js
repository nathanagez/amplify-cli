const { open } = require('amplify-cli-core');
const constants = require('./constants');

function console(context) {
  const amplifyMeta = context.amplify.getProjectMeta();
  const { envName } = context.amplify.getEnvInfo();
  const region = context.amplify.getEnvDetails()[envName].awscloudformation.Region;

  const kinesisFirehoseApp = scanCategoryMetaForKinesisFirehose(amplifyMeta[constants.CategoryName]);
  if (kinesisFirehoseApp) {
    const { Id } = kinesisFirehoseApp;
    const consoleUrl = `https://${region}.console.aws.amazon.com/firehose/home?region=${region}#/details/${Id}`;
    open(consoleUrl, { wait: false });
  } else {
    context.print.error('Kinesis Firehose is not enabled in the cloud.');
  }
}

function scanCategoryMetaForKinesisFirehose(categoryMeta) {
  // single kinesis resource for now
  let result;
  if (categoryMeta) {
    const services = Object.keys(categoryMeta);
    for (let i = 0; i < services.length; i++) {
      const serviceMeta = categoryMeta[services[i]];
      if (serviceMeta.service === constants.KinesisFirehoseName && serviceMeta.output && serviceMeta.output.kinesisFirehoseStreamId) {
        result = {
          Id: serviceMeta.output.kinesisFirehoseStreamId,
        };
        if (serviceMeta.output.Name) {
          result.Name = serviceMeta.output.Name;
        } else if (serviceMeta.output.appName) {
          result.Name = serviceMeta.output.appName;
        }

        if (serviceMeta.output.Region) {
          result.Region = serviceMeta.output.Region;
        }
        break;
      }
    }
  }
  return result;
}

function hasResource(context) {
  const amplifyMeta = context.amplify.getProjectMeta();
  return scanCategoryMetaForKinesisFirehose(amplifyMeta[constants.CategoryName]) !== undefined;
}

module.exports = {
  console,
  hasResource,
};
