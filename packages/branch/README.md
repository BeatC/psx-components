# Branch

### Overview

The Branch component is useful for running any of its child components on specified Git branches.

### Valid Props

| Name | Type   | Example  | Notes                               |
| :--- | :----- | :------- | :---------------------------------- |
| when | string | ^master$ | Should be a valid RegExp expression |

### Example Usage

```js
<Branch when="^master$">
  <Run command="echo on master branch!" />
</Branch>
```
