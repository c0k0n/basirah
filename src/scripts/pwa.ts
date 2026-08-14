import { registerSW } from "virtual:pwa-register";

registerSW({
	immediate: true,
	onOfflineReady() {
		console.info("[pwa] app is ready to work offline");
	},
	onRegisteredSW(swUrl) {
		console.info("[pwa] service worker registered:", swUrl);
	},
});
