const analyticsPipelineQuestions = [
  {
    key: 'glueDatabaseName',
    question: 'AWS Glue database name',
    validation: {
      operator: 'regex',
      value: '^[a-zA-Z0-9]+$',
      onErrorMsg: 'Name is invalid. Has to be non-empty and alphanumeric',
    },
    required: true,
  },
  {
    key: 'glueTableName',
    question: 'AWS Glue table name',
    validation: {
      operator: 'regex',
      value: '^[a-z0-9-]+$',
      onErrorMsg: 'Table name can only use the following characters: a-z 0-9 -',
    },
    required: true,
  },
  {
    key: 's3BucketName',
    question: 'S3 Bucket name',
    validation: {
      operator: 'regex',
      value: '^[a-z0-9-]{3,47}$',
      onErrorMsg:
        'Bucket name can only use the following characters: a-z 0-9 - and should have minimum 3 character and max of 47 character',
    },
    required: true,
  },
  {
    key: 's3BufferSize',
    question: 'S3 Buffer size',
    type: 'number',
    required: true,
  },
  {
    key: 's3BufferInterval',
    question: 'S3 Buffer interval',
    type: 'number',
    required: true,
  },
].map(question => ({
  when: ({ analyticsPipeline }) => !!analyticsPipeline,
  ...question,
}));

module.exports = {
  Pinpoint: {
    inputs: [
      {
        key: 'resourceName',
        question: 'Provide a friendly resource name:',
        validation: {
          operator: 'regex',
          value: '^[a-zA-Z0-9]+$',
          onErrorMsg: 'Resource name should be alphanumeric',
        },
        required: true,
      },
      {
        key: 'appName',
        question: 'Provide your pinpoint resource name:',
        validation: {
          operator: 'regex',
          value: '^[a-zA-Z0-9]+$',
          onErrorMsg: 'Resource name should be alphanumeric',
        },
        required: true,
      },
    ],
    defaultValuesFilename: 'pinpoint-defaults.js',
    serviceWalkthroughFilename: 'pinpoint-walkthrough.js',
    cfnFilename: 'pinpoint-cloudformation-template.yml.ejs',
    provider: 'awscloudformation',
    alias: 'Amazon Pinpoint',
  },
  Kinesis: {
    inputs: [
      {
        key: 'kinesisStreamName',
        question: 'Enter a Stream name',
        validation: {
          operator: 'regex',
          value: '^[a-zA-Z0-9]+$',
          onErrorMsg: 'Name is invalid. Has to be non-empty and alphanumeric',
        },
        required: true,
      },
      {
        key: 'kinesisStreamShardCount',
        question: 'Enter number of shards',
        type: 'number',
      },
    ],
    defaultValuesFilename: 'kinesis-defaults.js',
    serviceWalkthroughFilename: 'kinesis-walkthrough.js',
    cfnFilename: 'kinesis-cloudformation-template.json',
    provider: 'awscloudformation',
    alias: 'Amazon Kinesis Streams',
  },
  KinesisFirehose: {
    inputs: [
      {
        key: 'kinesisDeliveryStreamName',
        question: 'Enter a Delivery Stream name',
        validation: {
          operator: 'regex',
          value: '^[a-zA-Z0-9]+$',
          onErrorMsg: 'Delivery Stream name is invalid. Has to be non-empty and alphanumeric',
        },
        required: true,
      },
      {
        key: 'kinesisDeliveryStreamSource',
        question: 'How you would prefer to send records to the delivery stream ?',
        type: 'list',
        options: [
          {
            name: 'Direct PUT (S3)',
            value: 0,
          },
          {
            name: 'Kinesis Data Stream',
            value: 1,
          },
        ],
        required: true,
      },
      {
        key: 'kinesisStreamName',
        question: 'Enter a Stream name',
        validation: {
          operator: 'regex',
          value: '^[a-zA-Z0-9]+$',
          onErrorMsg: 'Name is invalid. Has to be non-empty and alphanumeric',
        },
        when: ({ kinesisDeliveryStreamSource }) => !!kinesisDeliveryStreamSource,
        required: true,
      },
      {
        key: 'kinesisStreamShardCount',
        question: 'Enter number of shards',
        type: 'number',
        required: true,
        when: ({ kinesisDeliveryStreamSource }) => !!kinesisDeliveryStreamSource,
      },
      {
        key: 'analyticsPipeline',
        question: 'Do you want to configure advanced settings?',
        type: 'confirm',
        required: true,
      },
      ...analyticsPipelineQuestions,
    ],
    defaultValuesFilename: 'firehose-defaults.js',
    serviceWalkthroughFilename: 'firehose-walkthrough.js',
    cfnFilename: 'firehose-cloudformation-template.json.ejs',
    provider: 'awscloudformation',
    alias: 'Amazon Kinesis Firehose',
  },
};
