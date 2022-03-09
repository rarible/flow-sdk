import * as process from "process"

export function logger(...args: Parameters<(typeof console)["log"]>): void {
	if (process.env.NODE_ENV !== "production") {
		console.log("flow-sdk logs:\n", ...args)
	}
}
