module.exports = {
	testEnvironment: "node",
	verbose: true,
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.ts?$": "ts-jest",
	},
}