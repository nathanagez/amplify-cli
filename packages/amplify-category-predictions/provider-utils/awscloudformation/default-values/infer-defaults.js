const uuid = require('uuid');

export default function getAllDefaults(project) {
  const region = project.amplifyMeta.providers.awscloudformation.Region;
  const [shortId] = uuid().split('-');
  const authRoleName = {
    Ref: 'AuthRoleName',
  };

  const unauthRoleName = {
    Ref: 'UnauthRoleName',
  };

  const defaults = {
    resourceName: `${shortId}`,
    region,
    inferPolicyName: `inferPolicy${shortId}`,
    service: 'SageMaker',
    authRoleName,
    unauthRoleName,
  };

  return defaults;
}
