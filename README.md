[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/sail-ci)

### Overview

A mono-repo that holds components that make up the components you can use within a `.psx` file when building pipelines and worflows for Sail CI.

These components once merged into the master branch are then automatically available for everyone to use within your `.psx` file.

We look forward to people contributing and suggesting components to make your CI pipeline and workflows super awesome.

### Component

A typical component is made up of the following:

```js
import exec from './exec';

export default {
  execute: async ({ command }) => {
    try {
      await exec(command);
    } catch (err) {
      console.log(err.message);

      throw err;
    }
  },
};
```

You will need to give your component a sensible and unique name within the packages folder.

This will end up being your component name CamelCase. For example the `run` package folder will become:

`<Run command="echo hello world" />`

when using the component within your psx file.

---

#### Component API

A component **must** return a default object with the following schema.

```js
{
  async execute ({ command }) => {}
  ...
}
```

Execute returns a promise, it is the core functionality of what you want your component to do. Feel free to get creative and use npm libraries at your disposal.
