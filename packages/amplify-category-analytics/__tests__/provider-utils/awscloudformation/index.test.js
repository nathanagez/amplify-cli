const inquirer = require('inquirer');
const mockirer = require('mockirer');
const { addResource, updateResource } = require('../../../provider-utils/awscloudformation/index');
jest.mock('amplify-cli-core');

const mockAnswers = {
  kinesisDeliveryStreamName: 'targetResourceName',
  kinesisStreamName: 'answers.kinesisStreamName',
  kinesisStreamShardCount: 'answers.kinesisStreamShardCount',
  glueTableName: 'answers.glueTableName',
  s3BucketName: 'answers.s3BucketName',
  glueDatabaseName: 'answers.glueDatabaseName',
  authRoleName: 'defaultValues.authRoleName',
  unauthRoleName: 'defaultValues.unauthRoleName',
  authPolicyName: 'defaultValues.authPolicyName',
  unauthPolicyName: 'defaultValues.unauthPolicyName,',
};

const mockContext = {
  print: {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
  amplify: {
    getResourceStatus: jest.fn().mockResolvedValue(() => ({ allResources: [] })),
    getProjectDetails: jest.fn(() => ({
      projectConfig: {
        projectName: 'mockProjectName',
      },
      amplifyMeta: mockAmplifyMeta,
    })),
    pathManager: {
      getBackendDirPath: jest.fn(() => 'backendDirPath'),
    },
    inputValidation: jest.fn(),
    invokePluginMethod: jest.fn(() => ({
      authEnabled: true,
    })),
    confirmPrompt: jest.fn(),
    copyBatch: jest.fn(),
  },
  usageData: {
    emitError: jest.fn(),
  },
};
const mockAmplifyMeta = {
  analytics: {
    amplifysandboxKinesisFirehose: {
      service: 'KinesisFirehose',
      providerPlugin: 'awscloudformation',
    },
  },
};

const WARNING_MESSAGES = {
  EXIST: 'Kinesis Firehose resource have already been added to your project.',
  AUTH: 'Adding analytics would add the Auth category to the project if not already added.',
  AUTH_OAUTHENTICATED: 'Authorize only authenticated users to send analytics events. Use "amplify update auth" to modify this behavior.',
};

const ERROR_MESSAGE = {
  NO_KDS:
    'No Kinesis Delivery stream resource to update. Please use "amplify add analytics" command to create a new Kinesis Delivery stream',
};

const SUCCESS_MESSAGE = {
  SELECT_RESOURCE: 'Selected resource ',
};

describe('addResource', () => {
  test('general workflow', async () => {
    mockirer(inquirer, mockAnswers);
    await addResource(mockContext, null, 'KinesisFirehose');
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.EXIST);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH_OAUTHENTICATED);
  });
});

describe('updateResource', () => {
  test('updateResource - No Kinesis Delivery Stream', async () => {
    mockirer(inquirer, mockAnswers);
    mockContext.amplify.getResourceStatus.mockImplementation(() => ({
      allResources: [],
    }));
    await updateResource(mockContext, null, 'KinesisFirehose');
    expect(mockContext.print.error).toBeCalledWith(ERROR_MESSAGE.NO_KDS);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.EXIST);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH_OAUTHENTICATED);
  });

  test('updateResource - Success', async () => {
    mockContext.amplify.getResourceStatus.mockImplementation(() => ({
      allResources: [{ service: 'KinesisFirehose', resourceName: 'amplifysandboxKinesisFirehose' }],
    }));
    mockirer(inquirer, mockAnswers);
    await updateResource(mockContext, null, 'KinesisFirehose');
    expect(mockContext.print.success).toBeCalledWith(SUCCESS_MESSAGE.SELECT_RESOURCE + 'amplifysandboxKinesisFirehose');
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.EXIST);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH);
    expect(mockContext.print.warning).toBeCalledWith(WARNING_MESSAGES.AUTH_OAUTHENTICATED);
  });
});
