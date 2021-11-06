export function fixAmount(amount: string): string {
	return amount.indexOf(".") === -1 ? amount + ".0" : amount
}
