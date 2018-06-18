describe('Slack component', () => {
  let Slack;

  beforeEach(() => {
    Date.now = () => 1529354187786;
    process.env.GIT_COMMIT_AUTHOR = 'Davey Dave';
    process.env.GIT_COMMIT_BRANCH = 'master';
    process.env.GIT_COMMIT_MESSAGE = 'Add some stuff';
    process.env.GIT_COMMIT_SHA = '1b23n45';
    process.env.PIPELINE_NUMBER = '1';
    process.env.REPO_NAME = 'psx-components';
    process.env.REPO_OWNER = 'sailci';
    process.env.REPO_URL = 'https://github.com/sailci/psx-components';
  });

  afterEach(() => {
    process.env.GIT_COMMIT_AUTHOR = undefined;
    process.env.GIT_COMMIT_BRANCH = undefined;
    process.env.GIT_COMMIT_MESSAGE = undefined;
    process.env.GIT_COMMIT_SHA = undefined;
    process.env.PIPELINE_NUMBER = undefined;
    process.env.REPO_NAME = undefined;
    process.env.REPO_OWNER = undefined;
    process.env.REPO_URL = undefined;
    process.env.WEBHOOK = undefined;

    jest.resetModules();
  });

  describe('#execute', () => {
    let sendProps;
    let webhookUrl;

    beforeEach(() => {
      class IncomingWebhookMock {
        constructor(hookUrl) {
          webhookUrl = hookUrl;
        }
        send(props) {
          sendProps = props;
        }
      }

      jest.doMock('@slack/client', () => ({
        IncomingWebhook: IncomingWebhookMock,
      }));
    });

    describe('when webhook starts with $', () => {
      beforeEach(() => {
        process.env.WEBHOOK = 'https://slack.com/webhook';
        Slack = require('.').default;
      });

      it('creates incomingWebhook with correct webhookUrl from environment', async () => {
        await Slack.execute({ webhook: '$WEBHOOK' }, {}, () =>
          Promise.resolve(),
        );

        expect(webhookUrl).toEqual('https://slack.com/webhook');
      });
    });

    describe('when webhook does not start with $', () => {
      beforeEach(() => {
        Slack = require('.').default;
      });

      it('creates incomingWebhook with correct webhookUrl from props', async () => {
        await Slack.execute({ webhook: 'https://slack.com/webhook' }, {}, () =>
          Promise.resolve(),
        );

        expect(webhookUrl).toEqual('https://slack.com/webhook');
      });
    });

    describe('when children are successful', () => {
      beforeEach(() => {
        Slack = require('.').default;
      });

      it('sends to incomingWebhook with correct properties', async () => {
        await Slack.execute({ webhook: 'https://slack.com' }, {}, () =>
          Promise.resolve(),
        );

        expect(sendProps).toEqual({
          attachments: [
            {
              color: 'good',
              footer: 'Sail CI',
              footer_icon:
                'https://storage.googleapis.com/sail-cdn/slack-icon.png',
              text:
                'Success for job #1 of <https://github.com/sailci/psx-components|sailci/psx-components> (<https://github.com/sailci/psx-components/tree/master|master>)\nDavey Dave: Add some stuff (<https://github.com/sailci/psx-components/commit/1b23n45|1b23n45>)',
              ts: 1529354187,
            },
          ],
        });
      });
    });

    describe('when children are unsuccessful', () => {
      beforeEach(() => {
        Slack = require('.').default;
      });

      it('sends to incomingWebhook with correct properties', async () => {
        try {
          await Slack.execute({ webhook: 'https://slack.com' }, {}, () =>
            Promise.reject(new Error('error')),
          );
        } catch (err) {
          // empty
        }

        expect(sendProps).toEqual({
          attachments: [
            {
              color: 'danger',
              footer: 'Sail CI',
              footer_icon:
                'https://storage.googleapis.com/sail-cdn/slack-icon.png',
              text:
                'Failure for job #1 of <https://github.com/sailci/psx-components|sailci/psx-components> (<https://github.com/sailci/psx-components/tree/master|master>)\nDavey Dave: Add some stuff (<https://github.com/sailci/psx-components/commit/1b23n45|1b23n45>)',
              ts: 1529354187,
            },
          ],
        });
      });

      it('throws the error from children', async () => {
        try {
          await Slack.execute({ webhook: 'https://slack.com' }, {}, () =>
            Promise.reject(new Error('error')),
          );
        } catch (err) {
          expect(err).toEqual(new Error('error'));
        }
      });
    });

    describe('#validate', () => {
      beforeEach(() => {
        Slack = require('.').default;
      });

      it('does not throw an error when webhook is a string', () => {
        expect(() =>
          Slack.validate({ webhook: 'https://slack.com' }),
        ).not.toThrow();
      });

      it('throws an error when webhook is not a string', () => {
        expect(() => Slack.validate({ webhook: 1 })).toThrow();
      });
    });
  });
});
