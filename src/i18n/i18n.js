
import en from './en-us';
import es from './es';

let i18n = {
  i18n: {
    // header: 'i18nBanner',
    enabled: true,
    banner: false,
    selector: true,
    topics: [ 'voting' ],
    // topics: [],
    // languages: [ 'en-us', 'es' ],
    languages: [
      {
        language: 'en-us',
        title: 'English',
      },
      {
        language: 'es',
        title: 'Español',
      },
    ],
    footer: true,
    data: {
      locale: 'en-us',
      messages: {
        'en-us': en,
        es: es,
      },
    },
  },
};

// console.log('atlas i18n.js, i18n:', i18n);

export default i18n;
