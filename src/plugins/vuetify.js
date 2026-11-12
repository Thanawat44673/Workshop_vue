import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#FF6D1F',
        secondary: '#F5E7C6',
        accent: '#FF6D1F',
        background: '#FAF3E1',
      },
    },
  },
});
