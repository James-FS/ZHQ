import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
