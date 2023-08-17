export const getBalanceScripts = {
	common: `
  import FungibleToken from address
  import %ftContract% from address

  pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account
      .getCapability(%ftBalancePublicPath%)
      .borrow<&%ftContract%.Vault{FungibleToken.Balance}>()

    return vaultRef?.balance ?? 0.0
  }`,
}
