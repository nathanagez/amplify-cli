const subcommand = 'add';
const category = 'analytics';
const servicesMetadata = require(`${__dirname}/../../provider-utils/supported-services`);

let options;

module.exports = {
  name: subcommand,
  run: async context => {
    const { amplify } = context;
    return amplify
      .serviceSelectionPrompt(context, category, servicesMetadata, 'Select an Analytics provider')
      .then(result => {
        options = {
          service: result.service,
          providerPlugin: result.providerName,
        };
        const providerController = require(`../../provider-utils/${result.providerName}/index`);
        if (!providerController) {
          context.print.error('Provider not configured for this category');
          return;
        }
        return providerController.addResource(context, category, result.service);
      })
      .then(resourceName => {
        if (resourceName) {
          amplify.updateamplifyMetaAfterResourceAdd(category, resourceName, options);
          const { print } = context;
          print.success(`Successfully added resource ${resourceName} locally`);
          print.info('');
          print.success('Some next steps:');
          print.info('"amplify push" builds all of your local backend resources and provisions them in the cloud');
          print.info(
            '"amplify publish" builds all your local backend and front-end resources (if you have hosting category added) and provisions them in the cloud',
          );
          print.info('');
        }
      })
      .catch(err => {
        context.print.info(err.stack);
        context.print.error('There was an error adding the analytics resource');
        context.usageData.emitError(err);
        process.exitCode = 1;
      });
  },
};
