# Flow SDK

Documentation for Flow SDK located [here](https://github.com/rarible/flow-sdk/tree/master/packages/flow-sdk)

Install mono-repository dependencies `yarn`
To install dependencies and add linking run `yarn bootstrap`
To build all packages use `yarn build-all`

NOTE: If you haven't declared the `NPM_TOKEN` variable in the environment variables, add it with any value or export it
temporarily for the current session `export NPM_TOKEN="123"`, otherwise the `yarn` commands will not work.

### Testing

To run tests you need to install [flow-cli](https://docs.onflow.org/flow-cli/install/)

NOTE: nodejs version 16.9.0 is interrupting on tests with Flow emulator in some cases. It's an upstream bug in V8
present in node 16.9.0. Here's more info about the bug: https://github.com/nodejs/node/issues/40030
