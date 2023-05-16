import {HWGarageCard, HWGaragePack, NFTStorefrontV2} from "./mattel-contracts"
import {barbieRawInitPart} from "./barbie"
import {garageRawInitPart} from "./garage"

export const txInitNFTContractsAndStorefrontV2: string = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken
import NFTStorefrontV2 from 0xNFTStorefrontV2

transaction() {
    prepare(acct: AuthAccount) {
${garageRawInitPart}
${barbieRawInitPart}

			if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
					let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			}
			if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
					acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
			}
    }
    execute {
    }
}`
