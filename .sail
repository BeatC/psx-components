<pipeline>
  <environment>
    <variable
      secret
      name="SLACK_WEBHOOK"
      value="CiQA4y//VWIoHlmUBGG6b0QwRobztve5EWFwSCxUoeIAsbwcxK4SdgAHJ2ynIs8dDyk/9tgNCbAJy3UDxanNh/zC5jWuSN4nLyTwLds3iXL4M2X5ukZvgNwQIXdWY6FTTcbsw3AoyrQ6lCIv14OdWMFrF5uCvQGOJOboWyZBbYdXjh/CL/uiZQnNmSFR9vRMgwrGv3VTjhkutJdrVzI="
    />
  </environment>
  <job image="node:9.2.1-alpine">
    <Slack webhook="$SLACK_WEBHOOK">
      <Run command="yarn" />
      <Run command="yarn lint" />
      <Run command="yarn test" />
    </Slack>
  </job>
</pipeline>
