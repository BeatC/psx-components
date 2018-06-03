# GoogleStorage

### Overview

The GoogleStorage component is a component to allow you to upload files
up to and into Google Cloud Storage.

### Prerequisite
`GOOGLE_APPLICATION_CREDENTIALS` needs to be set with relevant permissions to
the bucket you are uploading to.

### Valid Props

| Name    | Type   | Example                                        |
| :------ | :----- | :--------------------------------------------- |
| from    | string | directory uploading from                       |
| bucket  | string | bucket name to upload into                     |
| to      | string | folder prefix for remote storage (`/` default) |

### Example Usage

```js
  <GoogleStorage bucket="my-bucket" from="./public" to="./my-site" />
```
