const constants = require('../../lib/constants');

describe('constants', () => {
  test('should return correct constant values', () => {
    const reference = {
      CategoryName: 'analytics',
      NotificationsCategoryName: 'notifications',
      PinpointName: 'Pinpoint',
      KinesisName: 'Kinesis',
      KinesisFirehoseName: 'KinesisFirehose',
    };
    expect(constants).toMatchObject(reference);
  });
});
