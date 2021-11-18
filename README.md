# Flow SDK

Documentation for Flow SDK located [here](https://github.com/rarible/flow-sdk/tree/master/packages/flow-sdk)

To install dependencies and add linking run `yarn bootstrap`

To build all packages use `yarn build-all`

### Testing

To run tests you need to install [flow-cli](https://docs.onflow.org/flow-cli/install/)

NOTE: nodejs version 16.9.0 is interrupting on tests with Flow emulator in some cases. It's an upstream bug in V8
present in node 16.9.0. Here's more info about the bug: https://github.com/nodejs/node/issues/40030
