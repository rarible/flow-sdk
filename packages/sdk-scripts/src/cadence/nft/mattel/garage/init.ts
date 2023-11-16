import {HWGarageCard, HWGarageCardV2, HWGaragePack, HWGaragePackV2, HWGarageTokenV2, NFTStorefrontV2} from "../../contracts"

export const garageRawInitPart = `
      if acct.borrow<&${HWGarageCard.name}.${HWGarageCard.contractType}>(from: ${HWGarageCard.storagePath}) == nil {
			    let collection <- ${HWGarageCard.name}.${HWGarageCard.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGarageCard.storagePath})
			}
			if acct.getCapability<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}).borrow() == nil {
					acct.link<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}, target: ${HWGarageCard.storagePath})
			}

			if acct.borrow<&${HWGarageCardV2.name}.${HWGarageCardV2.contractType}>(from: ${HWGarageCardV2.storagePath}) == nil {
					let collection <- ${HWGarageCardV2.name}.${HWGarageCardV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGarageCardV2.storagePath})
			}
			if acct.getCapability<${HWGarageCardV2.publicType}>(${HWGarageCardV2.publicPath}).borrow() == nil {
					acct.link<${HWGarageCardV2.publicType}>(${HWGarageCardV2.publicPath}, target: ${HWGarageCardV2.storagePath})
			}

			if acct.borrow<&${HWGaragePack.name}.${HWGarageCard.contractType}>(from: ${HWGaragePack.storagePath}) == nil {
					let collection <- ${HWGaragePack.name}.${HWGaragePack.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGaragePack.storagePath})
			}
			if acct.getCapability<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}).borrow() == nil {
					acct.link<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}, target: ${HWGaragePack.storagePath})
			}

			if acct.borrow<&${HWGaragePackV2.name}.${HWGaragePackV2.contractType}>(from: ${HWGaragePackV2.storagePath}) == nil {
					let collection <- ${HWGaragePackV2.name}.${HWGaragePackV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGaragePackV2.storagePath})
			}
			if acct.getCapability<${HWGaragePackV2.publicType}>(${HWGaragePackV2.publicPath}).borrow() == nil {
					acct.link<${HWGaragePackV2.publicType}>(${HWGaragePackV2.publicPath}, target: ${HWGaragePackV2.storagePath})
			}

			if acct.borrow<&${HWGarageTokenV2.name}.${HWGarageTokenV2.contractType}>(from: ${HWGarageTokenV2.storagePath}) == nil {
					let collection <- ${HWGarageTokenV2.name}.${HWGarageTokenV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGarageTokenV2.storagePath})
			}
			if acct.getCapability<${HWGarageTokenV2.publicType}>(${HWGarageTokenV2.publicPath}).borrow() == nil {
					acct.link<${HWGarageTokenV2.publicType}>(${HWGarageTokenV2.publicPath}, target: ${HWGarageTokenV2.storagePath})
			}
`
export const garagePreparePartOfInit = `
${garageRawInitPart}

			if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
					let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			}
			if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
					acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
			}
`
