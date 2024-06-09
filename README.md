# Aave SDK

## [Aave V3 React is out!](https://www.npmjs.com/package/aave-v3-react)

![banner](https://github.com/akanoce/react-aave-sdk/blob/main/assets/banner.jpg)

Collections of hooks and providers to make development on top of the aave contracts and pools a breeze.

## Development

### Install the packages

`yarn`

### Run the example apps

`yarn dev`

### Contribute to the sdk

The core hooks and logics of the sdk are located unders `/packages/react-sdk`.

While running `yarn dev`, any edit to the files should be reflected in real-time in the example apps.

#### Committing

This repo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) via [commitlint](https://github.com/conventional-changelog/commitlint). commitlint is enforced via an husky pre-commit hook.

This means all the commits have to follow a specific structure like:

- feat(sdk): add new feature;
- fix(vite-app): avoid re-render;
