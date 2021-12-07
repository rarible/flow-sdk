declare module "@onflow/fcl"
declare module "@onflow/config"
declare module "flow-js-testing" {
	function init(basePath: string): Promise<void>

	function mintFlow(recipient: string, amount: string): Promise<any>

	function executeScript(props: object): Promise<any>

	function getContractAddress(name: string, useDefaults: boolean): Promise<string>

	function deployContractByName(props: { name: string, to: string, addressMap?: object }): Promise<any>

	const emulator: any

	function getAccountAddress(accountName: string): Promise<string>

	function getServiceAddress()
}
