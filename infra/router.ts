export function getDomain({
	protocol,
	skipLocalhost,
}: { protocol?: string; skipLocalhost?: boolean }): string {
	let result: string;
	switch ($app.stage) {
		case "prod":
			result = "jetbridge.com";
			break;
		case "dev":
		case "adam":
		case "justme":
			if (skipLocalhost) {
				result = "jetbridge.click";
			} else {
				result = "http://localhost:3000";
			}
			break;
		default:
			result = skipLocalhost ? "jetbridge.click" : "http://localhost:3000";
	}
	if (protocol && !result.startsWith("http")) {
		result = `${protocol}://${result}`;
	}
	return result;
}

const domain = getDomain({ skipLocalhost: true });

export const router = new sst.aws.Router("StarterRouter", {
	domain: {
		name: domain,
		aliases: [`*.${domain}`],
	},
});
