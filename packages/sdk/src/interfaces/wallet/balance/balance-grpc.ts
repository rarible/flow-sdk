import type { ExecuteScriptResponse } from "@onflow/protobuf/src/generated/flow/access/access_pb"
import type { grpc as GrpcType } from "@improbable-eng/grpc-web"
import { NODE_GRPC_TRANSPORT_CONFIG } from "../../../config/config"
import { FlowUtilsStringDataType, getPreparedCadenceScript } from "../common/utils"
import type { GetFtBalanceRequest } from "./domain"

async function unary(
	host: string, request: any,
): Promise<ExecuteScriptResponse> {

	const { grpc } = (await import("@improbable-eng/grpc-web")) as { grpc: typeof GrpcType }
	const { NodeHttpTransport } = await import("@improbable-eng/grpc-web-node-http-transport")
	const { AccessAPI } = await import("@onflow/protobuf/src/generated/flow/access/access_pb_service")

	grpc.setDefaultTransport(NodeHttpTransport())
	return new Promise((resolve, reject) => {
		grpc.unary(AccessAPI.ExecuteScriptAtLatestBlock, {
			request: request,
			host: host,
			metadata: undefined,
			onEnd: ({ status, statusMessage, message }) => {
				if (status === grpc.Code.OK) {
					resolve(message as ExecuteScriptResponse)
				} else {
					reject(new Error(statusMessage))
				}
			},
		})
	})
}

export async function getFungibleBalanceSimpleGrpc(request: GetFtBalanceRequest): Promise<string> {

	const { ExecuteScriptAtLatestBlockRequest } = await import("@onflow/protobuf/src/generated/flow/access/access_pb")

	const req = new ExecuteScriptAtLatestBlockRequest()
	const { network, address, currency } = request
	const preparedScript = getPreparedCadenceScript(network, currency, FlowUtilsStringDataType.utf8)

	req.addArguments(argumentBuffer({ "type": "Address", "value": address }))
	req.setScript(Buffer.from(preparedScript, "utf8"))

	const res = await unary(NODE_GRPC_TRANSPORT_CONFIG[network], req)

	const { value } = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))
	return value
}

const argumentBuffer = (arg: object) => Buffer.from(JSON.stringify(arg), "utf8")
