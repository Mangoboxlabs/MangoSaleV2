import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/style/index.scss"
import 'ant-design-vue/dist/antd.css';
import 'vant/lib/index.css';
import {Button,Popover} from "ant-design-vue";
import 'animate.css';
import {message} from "ant-design-vue";
import TryBankerHeader from "@/components/TryBankerHeader";
const app = createApp(App)
app.component("TryBankerHeader",TryBankerHeader)

app.use(Button).use(Popover).use(message).use(store).use(router).mount('#app')
