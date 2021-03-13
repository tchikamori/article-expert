import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ContextMenu from 'primevue/contextmenu';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Menubar from 'primevue/menubar';

import 'primevue/resources/themes/bootstrap4-light-purple/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import 'primeflex/primeflex.css';
import './registerServiceWorker'


const app = createApp(App)
app.use(PrimeVue);

app.component('ContextMenu', ContextMenu);
app.component('pvTextarea', Textarea);
app.component('pvButton', Button);
app.component('pvDropdown', Dropdown);
app.component('pvMenuBar', Menubar);
app.mount('#app')