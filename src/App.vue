<script setup>
if (import.meta.env.VITE_DEBUG == 'true') console.log('App.vue setup is running in debug mode');

import isMobileDevice from './util/is-mobile-device';
import isMac from './util/is-mac'; // this can probably be removed from App.vue, and only run in main.js

import i18nFromFiles from './i18n/i18n.js';
const languages = i18nFromFiles.i18n.languages;

// STORES
import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();

if (!import.meta.env.VITE_PUBLICPATH) {
  MainStore.publicPath = '/';
} else {
  MainStore.publicPath = import.meta.env.VITE_PUBLICPATH;
}
if (import.meta.env.VITE_DEBUG == 'true') console.log('import.meta.env.VITE_PUBLICPATH:', import.meta.env.VITE_PUBLICPATH, 'MainStore.publicPath:', MainStore.publicPath);

// ROUTER
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

import { onMounted, computed, getCurrentInstance, watch } from 'vue';

// COMPONENTS
import TopicPanel from '@/components/TopicPanel.vue';
import MapPanel from '@/components/MapPanel.vue';

const instance = getCurrentInstance();
// if (import.meta.env.VITE_DEBUG == 'true') console.log('instance:', instance);
const locale = computed(() => instance.appContext.config.globalProperties.$i18n.locale);
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[locale.value];
})
if (import.meta.env.VITE_DEBUG == 'true') console.log('locale:', locale, 'messages:', messages);

onMounted(async () => {
  MainStore.isMobileDevice = isMobileDevice();
  MainStore.isMac = isMac();
  await router.isReady()
  if (import.meta.env.VITE_DEBUG == 'true') console.log('App onMounted, route.name:', route.name, 'route.params.topic:', route.params.topic, 'route.params.address:', route.params.address, 'route.query:', route.query);
  if (route.name === 'not-found') {
    router.push({ name: 'home' });
  }
  if (route.params.topic) {
    MainStore.currentTopic = route.params.topic.toLowerCase();
  }

  if (route.query.lang) {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('instance:', instance);
    instance.appContext.config.globalProperties.$i18n.locale = route.query.lang;
  }

  const main = document.getElementById('main');
  main.scrollTop = -main.scrollHeight;

  window.addEventListener('resize', handleWindowResize);
  handleWindowResize();
});

const links = [
  {
    type: 'native',
    href: 'https://phila.formstack.com/forms/atlas_feedback_form',
    text: 'Feedback',
    attrs: {
      target: '_blank',
    },
  },
];

const handleWindowResize = () => {
  const rootElement = document.getElementById('app');
  const rootStyle = window.getComputedStyle(rootElement);
  const rootWidth = rootStyle.getPropertyValue('width');
  const rootHeight = rootStyle.getPropertyValue('height');
  const rootWidthNum = parseInt(rootWidth.replace('px', ''));
  const rootHeightNum = parseInt(rootHeight.replace('px', ''));

  const dim = {
    width: rootWidthNum,
    height: rootHeightNum,
  };
  MainStore.windowDimensions = dim;
}

const fullScreenTopicsEnabled = computed(() => {
  return MainStore.fullScreenTopicsEnabled;
});

const fullScreenMapEnabled = computed(() => {
  return MainStore.fullScreenMapEnabled;
});

watch(
  () => MainStore.currentLang,
  (newLang, oldLang) => {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('watch MainStore.currentLang:', newLang, oldLang, 'locale.value:', locale.value);
    if (newLang != locale.value) {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('setting locale:', newLang);
      // const instance = getCurrentInstance();
      if (import.meta.env.VITE_DEBUG == 'true') console.log('instance:', instance);
      if (instance) {
        if (import.meta.env.VITE_DEBUG == 'true') console.log('instance:', instance);
        if (newLang) {
          instance.appContext.config.globalProperties.$i18n.locale = newLang;
        } else {
          instance.appContext.config.globalProperties.$i18n.locale = 'en-us';
        }
      }
    }
  }
)

watch(
  () => locale.value,
  (newLocale, oldLocale) => {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('watch locale:', newLocale, oldLocale);
    if (newLocale === MainStore.currentLang) {
      return;
    }
    if (newLocale && newLocale != 'en-us') {
      router.push({ query: { 'lang': newLocale }});
    } else {
      router.push({ fullPath: route.path });
    }
    if (newLocale) {
      MainStore.currentLang = newLocale;
    }
  }
)

watch(
  () => MainStore.pageTitle,
  (newPageTitle) => {
    document.title = newPageTitle;
  }
)

const brandingImage = computed(() => {
  let value = null;
  if (MainStore.windowDimensions.width > 767) {
    value = {
      src: '/images/philadelphia-city-commissioners-logo-edit_6.png',
      alt: 'Philadelphia City Commissioners logo',
      width: '250px',
    }
  }
  return value;
})

</script>

<template>
  <a
    href="#main"
    class="skip-to-main-content-link"
  >Skip to main content</a>

  <app-header
    :app-title="$t('app.title')"
    :branding-image="brandingImage"
    app-link="/"
    :is-sticky="true"
    :is-fluid="true"
  >
    <template #mobile-nav>
      <mobile-nav :links="links" />
    </template>
    <template #lang-selector-nav>
      <lang-selector :languages="languages" />
    </template>
  </app-header>

  <!-- MAIN CONTENT -->
  <main
    id="main"
    class="main invisible-scrollbar"
  >
    <!-- TOPIC PANEL ON LEFT -->
    <div
      v-if="!isMobileDevice() && MainStore.windowDimensions.width > 768 && !fullScreenMapEnabled"
      class="topics-holder"
      :class="fullScreenTopicsEnabled ? 'topics-holder-full' : ''"
    >
      <topic-panel />
    </div>

    <!-- MAP PANEL ON RIGHT - right now only contains the address input -->
    <div
      v-show="!fullScreenTopicsEnabled"
      class="map-panel-holder"
      :class="fullScreenMapEnabled ? 'topics-holder-full' : ''"
    >
      <map-panel />
    </div>

    <div
      v-if="isMobileDevice() || MainStore.windowDimensions.width <= 768"
      class="topics-holder"
    >
      <topic-panel />
    </div>
  </main>

  <!-- FOOTER -->
  <app-footer
    :is-sticky="true"
    :is-hidden-mobile="true"
    :links="links"
  />
</template>

<style>

.branding-col {
  padding-bottom: 0px !important;
}


@media 
only screen and (max-width: 767px) {
  .dropdown-nav {
    span:nth-of-type(even) {
      display: none;
    }
  }
}




</style>