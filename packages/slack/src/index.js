import { IncomingWebhook } from '@slack/client';

const {
  GIT_COMMIT_AUTHOR,
  GIT_COMMIT_BRANCH,
  GIT_COMMIT_MESSAGE,
  GIT_COMMIT_SHA,
  PIPELINE_NUMBER,
  REPO_NAME,
  REPO_OWNER,
  REPO_URL,
} = process.env;

const constructText = error => {
  const result = error ? 'Failure' : 'Success';
  const shortSha = GIT_COMMIT_SHA.substr(0, 7);

  const text = `${result} for job #${PIPELINE_NUMBER} of <${REPO_URL}|${REPO_OWNER}/${REPO_NAME}> (<${REPO_URL}/tree/${GIT_COMMIT_BRANCH}|${GIT_COMMIT_BRANCH}>)`;
  const detail = `${GIT_COMMIT_AUTHOR}: ${GIT_COMMIT_MESSAGE} (<${REPO_URL}/commit/${shortSha}|${shortSha}>)`;

  return `${text}\n${detail}`;
};

export default {
  execute: async ({ webhook }, context, next) => {
    const webhookUrl = webhook.startsWith('$')
      ? process.env[webhook.substring(1)]
      : webhook;

    let error;

    try {
      await next();
    } catch (err) {
      error = err;
    }

    const incomingWebhook = new IncomingWebhook(webhookUrl);
    const text = constructText(error);

    await incomingWebhook.send({
      attachments: [
        {
          text,
          color: error ? 'danger' : 'good',
          footer: 'Sail CI',
          footer_icon: 'https://storage.googleapis.com/sail-cdn/slack-icon.png',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    });

    if (error) {
      throw error;
    }
  },
  validate: ({ webhook }) => {
    if (typeof webhook !== 'string') {
      throw new Error('"webhook" of "Slack" can only be a "string"');
    }
  },
};
