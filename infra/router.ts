const baseUrl = "plantiq.jetbridge.click";
const LOCAL_URL = "http://localhost:3000";

export function getDomain({
	protocol,
	skipLocalhost,
}: { protocol?: string; skipLocalhost?: boolean }): string {
	let result: string;
	switch ($app.stage) {
		case "prod":
			result = baseUrl;
			break;
		case "dev":
		case "adam":
		case "justme":
			if (skipLocalhost) {
				result = baseUrl;
			} else {
				result = LOCAL_URL;
			}
			break;
		default:
			result = skipLocalhost ? baseUrl : LOCAL_URL;
	}
	if (protocol && !result.startsWith("http")) {
		result = `${protocol}://${result}`;
	}
	return result;
}

const domain = getDomain({ skipLocalhost: true });

export const router = new sst.aws.Router("PlantIQRouter", {
	domain: {
		name: domain,
		aliases: [`*.${domain}`],
	},
});
