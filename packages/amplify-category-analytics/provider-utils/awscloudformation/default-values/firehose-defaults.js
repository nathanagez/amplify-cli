const uuid = require('uuid');

const getAllDefaults = project => {
  const appName = project.projectConfig.projectName.toLowerCase();
  const [shortId] = uuid().split('-');

  const authRoleName = {
    Ref: 'AuthRoleName',
  };

  const unauthRoleName = {
    Ref: 'UnauthRoleName',
  };

  const defaults = {
    kinesisDeliveryStreamName: `${appName}KinesisFirehose`,
    kinesisStreamName: `${appName}KinesisStream`,
    kinesisStreamShardCount: 1,
    glueDatabaseName: `${appName}GlueDatabase`,
    glueTableName: `${appName}-gluetable`,
    s3BucketName: `${appName}-bucket`,
    s3BufferSize: 128,
    s3BufferInterval: 300,
    authRoleName,
    unauthRoleName,
    authPolicyName: `kinesis_firehose_amplify_${shortId}`,
    unauthPolicyName: `kinesis_firehose_amplify_${shortId}`,
  };

  return defaults;
};

module.exports = {
  getAllDefaults,
};
