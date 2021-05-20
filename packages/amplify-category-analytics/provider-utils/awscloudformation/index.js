const { NotImplementedError, exitOnNextTick } = require('amplify-cli-core');
const supportedServices = require(`${__dirname}/../supported-services`);

function addResource(context, category, service) {
  const serviceMetadata = supportedServices[service];
  const { defaultValuesFilename, serviceWalkthroughFilename } = serviceMetadata;

  const serviceWalkthroughSrc = `${__dirname}/service-walkthroughs/${serviceWalkthroughFilename}`;
  const { addWalkthrough } = require(serviceWalkthroughSrc);

  return addWalkthrough(context, defaultValuesFilename, serviceMetadata);
}

function updateResource(context, category, service) {
  const serviceMetadata = supportedServices[service];
  const { defaultValuesFilename, serviceWalkthroughFilename } = serviceMetadata;
  const serviceWalkthroughSrc = `${__dirname}/service-walkthroughs/${serviceWalkthroughFilename}`;
  const { updateWalkthrough } = require(serviceWalkthroughSrc);

  if (!updateWalkthrough) {
    const message = 'Update functionality not available for this service';
    context.print.error(message);
    context.usageData.emitError(new NotImplementedError(message));
    exitOnNextTick(0);
  }

  return updateWalkthrough(context, defaultValuesFilename, serviceMetadata);
}

function getPermissionPolicies(context, service, resourceName, crudOptions) {
  const serviceMetadata = supportedServices[service];
  const { serviceWalkthroughFilename } = serviceMetadata;
  const serviceWalkthroughSrc = `${__dirname}/service-walkthroughs/${serviceWalkthroughFilename}`;
  const { getIAMPolicies } = require(serviceWalkthroughSrc);

  if (!getPermissionPolicies) {
    context.print.info(`No policies found for ${resourceName}`);
    return;
  }

  return getIAMPolicies(resourceName, crudOptions);
}

module.exports = { addResource, getPermissionPolicies, updateResource };
