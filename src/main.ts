import { createApp } from 'vue'
import { Quasar } from 'quasar'

import App from './App.vue'

import './assets/main.css'

//tailwind css
import './assets/styles/index.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })

myApp.mount('#app')
