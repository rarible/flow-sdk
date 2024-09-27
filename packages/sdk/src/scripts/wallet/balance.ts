export const getBalanceScripts = {
	common: `
  import FungibleToken from address
  import %ftContract% from address

  access(all)
  fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.capabilities.borrow<&{FungibleToken.Balance}>(%ftBalancePublicPath%)

    return vaultRef?.balance ?? 0.0
  }`,
}
