# Slack

### Overview

The Slack component will report success or failure for any of the components it wraps.

### Valid Props

| Name    | Type   | Example                                                  |
| :------ | :----- | :------------------------------------------------------- |
| webhook | string | '$SLACK_WEBHOOK' or 'https://hooks.slack.com/services/…' |

If you have set your Slack webhook as an environment variable then supplying the `webhook` prop with the name of the environment variable prefixed with `$` will cause the Slack component to use that instead.

### Example Usage

```js
<job>
  <Slack webhook="https://hooks.slack.com/services/…">
    <Run command="yarn" />
    <Run command="yarn lint" />
    <Run command="yarn test" />
  </Slack>
</job>
```
