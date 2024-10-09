import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';
import $config from '@/config';

import { useGeocodeStore } from '@/stores/GeocodeStore.js'
import { useParcelsStore } from '@/stores/ParcelsStore.js'
import { useBallotsStore } from '@/stores/BallotsStore.js'
import { usePollingPlaceStore } from '@/stores/PollingPlaceStore.js'
import { useVoteByMailStore } from '@/stores/VoteByMailStore.js'
import { useElectedOfficialsStore } from '@/stores/ElectedOfficialsStore'
import { useMainStore } from '@/stores/MainStore.js'

import useRouting from '@/composables/useRouting';
const { routeApp } = useRouting();

import i18nFromFiles from '../i18n/i18n.js';
console.log('i18nFromFiles:', i18nFromFiles.i18n.data.messages['en-us']);

// this runs on address search and as part of datafetch()
const clearStoreData = async() => {
  if (import.meta.env.VITE_DEBUG == 'true') console.log('clearStoreData is running');
  const MainStore = useMainStore();
  MainStore.clearDataSourcesLoadedArray();

  const BallotsStore = useBallotsStore();
  BallotsStore.clearAllBallotsData();
  const PollingPlaceStore = usePollingPlaceStore();
  PollingPlaceStore.clearAllPollingPlaceData();
  const VoteByMailStore = useVoteByMailStore();
  VoteByMailStore.clearAllVoteByMailData();
  const ElectedOfficialsStore = useElectedOfficialsStore();
  ElectedOfficialsStore.clearAllElectedOfficialsData();
}

const getGeocodeAndPutInStore = async(address) => {
  const GeocodeStore = useGeocodeStore();
  const MainStore = useMainStore();
  await GeocodeStore.fillAisData(address);
  if (MainStore.lastSearchMethod == 'address' && !GeocodeStore.aisData.features) {
    MainStore.currentAddress = null;
    if (import.meta.env.VITE_DEBUG == 'true') console.log('getGeocodeAndPutInStore, calling not-found');
    MainStore.currentTopic = null;
    router.push({ name: 'not-found' });
    return;
  } else if (!GeocodeStore.aisData.features) {
    return;
  }
  let currentAddress;
  if (GeocodeStore.aisData.features[0].properties.street_address) {
    currentAddress = GeocodeStore.aisData.features[0].properties.street_address;
  } else if (GeocodeStore.aisData.features[0].street_address) {
    currentAddress = GeocodeStore.aisData.features[0].street_address;
  }
  MainStore.setCurrentAddress(currentAddress);
  // MainStore.addressSearchRunning = false;
}

// this ONLY runs on map click
const getParcelsAndPutInStore = async(lng, lat) => {
  if (import.meta.env.VITE_DEBUG == 'true') console.log('getParcelsAndPutInStore is running');
  const MainStore = useMainStore();
  let currentTopic = MainStore.currentTopic;
  const parcelLayer = $config.parcelLayerForTopic[currentTopic] || 'pwd';
  const ParcelsStore = useParcelsStore();
  await ParcelsStore.checkParcelDataByLngLat(lng, lat, 'pwd');
  await ParcelsStore.checkParcelDataByLngLat(lng, lat, 'dor');
  if (parcelLayer === 'dor' && !Object.keys(ParcelsStore.dorChecked).length) {
    return;
  } else if (parcelLayer === 'pwd' && !Object.keys(ParcelsStore.pwdChecked).length) {
    return;
  }
  ParcelsStore.pwd = ParcelsStore.pwdChecked;
  ParcelsStore.dor = ParcelsStore.dorChecked;

  // collects 4 things to attempt to geocode from the parcels clicked
  const otherParcelLayer = parcelLayer === 'pwd' ? 'dor' : 'pwd';
  const addressField = parcelLayer === 'pwd' ? 'ADDRESS' : 'ADDR_SOURCE';
  const otherAddressField = otherParcelLayer === 'pwd' ? 'ADDRESS' : 'ADDR_SOURCE';
  const geocodeParameterField = parcelLayer === 'pwd' ? 'PARCELID' : 'MAPREG';
  const otherGeocodeParameterField = otherParcelLayer === 'pwd' ? 'PARCELID' : 'MAPREG';
  
  // if (import.meta.env.VITE_DEBUG == 'true') console.log('parcelLayer:', parcelLayer);
  if (ParcelsStore[parcelLayer].features) {
    MainStore.currentParcelAddress = ParcelsStore[parcelLayer].features[0].properties[addressField];
    MainStore.currentParcelGeocodeParameter = ParcelsStore[parcelLayer].features[0].properties[geocodeParameterField]
    // if (import.meta.env.VITE_DEBUG == 'true') console.log('ParcelsStore[parcelLayer].features[i].properties[geocodeParameterField]:', ParcelsStore[parcelLayer].features[0].properties[geocodeParameterField], 'ParcelsStore[parcelLayer].features[i].properties[otherGeocodeParameterField]:', ParcelsStore[parcelLayer].features[0].properties[otherGeocodeParameterField]);
    // if (import.meta.env.VITE_DEBUG == 'true') console.log('MainStore.currentParcelAddress:', MainStore.currentParcelAddress);
  }
  if (ParcelsStore[otherParcelLayer].features) {
    MainStore.otherParcelAddress = ParcelsStore[otherParcelLayer].features[0].properties[otherAddressField];
    MainStore.otherParcelGeocodeParameter = ParcelsStore[otherParcelLayer].features[0].properties[otherGeocodeParameterField]
    // if (import.meta.env.VITE_DEBUG == 'true') console.log('else MainStore.otherParcelAddress:', MainStore.otherParcelAddress);
  }
  // MainStore.addressSearchRunning = false;
}

// it should only show an address at the top that has been found in AIS for the top line address, so, if map clicked, it
// goes through all of the clicked parcel info, running it against AIS until it gets a match
const checkParcelInAis = async() => {
  // if (import.meta.env.VITE_DEBUG == 'true') console.log('checkParcelInAis starting');
  const GeocodeStore = useGeocodeStore();
  const MainStore = useMainStore();
  await GeocodeStore.checkAisData(MainStore.currentParcelGeocodeParameter);
  if (GeocodeStore.aisDataChecked.features) {
    MainStore.currentAddress = GeocodeStore.aisDataChecked.features[0].properties.street_address;
  } else {
    // if (import.meta.env.VITE_DEBUG == 'true') console.log('checkParcelInAis, noAisData currentParcelGeocodeParameter');
    await GeocodeStore.checkAisData(MainStore.otherParcelGeocodeParameter);
    if (GeocodeStore.aisDataChecked.features) {
      MainStore.currentAddress = GeocodeStore.aisDataChecked.features[0].properties.street_address;
    } else {
      // if (import.meta.env.VITE_DEBUG == 'true') console.log('checkParcelInAis, noAisData otherParcelGeocodeParameter');
      await GeocodeStore.checkAisData(MainStore.currentParcelAddress);
      if (GeocodeStore.aisDataChecked.features) {
        MainStore.currentAddress = GeocodeStore.aisDataChecked.features[0].properties.street_address;
      } else {
        // if (import.meta.env.VITE_DEBUG == 'true') console.log('checkParcelInAis, noAisData currentParcelAddress');
        await GeocodeStore.checkAisData(MainStore.otherParcelAddress);
        if (GeocodeStore.aisDataChecked.features) {
          MainStore.currentAddress = GeocodeStore.aisDataChecked.features[0].properties.street_address;
        } else {
          // if (import.meta.env.VITE_DEBUG == 'true') console.log('checkParcelInAis, noAisData otherParcelAddress');
        }
      }
    }
  }
}

// this is called on every route change, including address searches, topic changes, initial app load, and back button clicks
// when it is called, it may have some of the data it needs already in the store (after a geocode), or it may need to fetch everything (e.g. initial app load)
const dataFetch = async(to, from) => {
  if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch is starting, to:', to, 'from:', from, 'to.params.address:', to.params.address, 'from.params.address:', from.params.address, 'to.params.topic:', to.params.topic, 'from.params.topic:', from.params.topic);
  const MainStore = useMainStore();
  MainStore.datafetchRunning = true;
  const GeocodeStore = useGeocodeStore();
  const ParcelsStore = useParcelsStore();
  const dataSourcesLoadedArray = MainStore.dataSourcesLoadedArray;
  if (to.name === 'not-found') {
    MainStore.datafetchRunning = false;
    return;
  }

  if (to.name === 'address') {
    MainStore.currentTopic = '';
  } else {
    if (!MainStore.currentTopic && to.params.topic) {
      MainStore.currentTopic = to.params.topic.toLowerCase();
    }
  }
  
  let address, topic;
  if (to.params.address) {
    address = to.params.address;
    MainStore.currentAddress = to.params.address;
  } else if (to.query.address) { address = to.query.address }
  if (to.params.topic) { topic = to.params.topic.toLowerCase() }

  if (import.meta.env.VITE_DEBUG == 'true') console.log('address:', address, 'to.params.address:', to.params.address, 'from.params.address:', from.params.address, 'GeocodeStore.aisData.normalized:', GeocodeStore.aisData.normalized);
  
  let routeAddressChanged;
  if (to.params.address && from.params.address) {
    routeAddressChanged = to.params.address.trim() !== from.params.address.trim();
  } else {
    routeAddressChanged = to.params.address !== from.params.address;
  }

  // In the config, there is a list called "addressDoubles" of addresses we know of that are used by multiple properties.
  // An exception has to be made for them, in the case that someone clicks from one of them to the other.
  if ($config.addressDoubles.includes(address) || routeAddressChanged) {
    // if there is no geocode or the geocode does not match the address in the route, get the geocode
    if (!GeocodeStore.aisData.normalized || GeocodeStore.aisData.normalized && GeocodeStore.aisData.normalized !== address) {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('in datafetch, routeAddressChanged:', routeAddressChanged, 'right before geocode, GeocodeStore.aisData:', GeocodeStore.aisData);
      await clearStoreData();
      if (GeocodeStore.aisDataChecked.features) {
        GeocodeStore.aisData = GeocodeStore.aisDataChecked;
        GeocodeStore.aisDataChecked = {};
      } else {
        await getGeocodeAndPutInStore(address);
      }
    }
    if (import.meta.env.VITE_DEBUG == 'true') console.log('in datafetch, after geocode, GeocodeStore.aisData:', GeocodeStore.aisData);

    // if this was NOT started by a map click, get the parcels
    if (MainStore.lastSearchMethod !== 'mapClick') {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch, inside if dataSourcesLoadedArray[0]:', dataSourcesLoadedArray[0], 'routeAddressChanged:', routeAddressChanged);
      await ParcelsStore.fillPwdParcelData();
      if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch, inside if2 dataSourcesLoadedArray[0]:', dataSourcesLoadedArray[0], 'routeAddressChanged:', routeAddressChanged);
      await ParcelsStore.fillDorParcelData();
    }

  } else if (to.params.topic !== 'nearby' && dataSourcesLoadedArray.includes(topic)) {
    MainStore.datafetchRunning = false;
    return;
  } else if (to.params.topic === 'nearby' && dataSourcesLoadedArray.includes(to.params.data)) {
    MainStore.currentNearbyDataType = to.params.data;
    if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch is still going, MainStore.currentNearbyDataType:', MainStore.currentNearbyDataType, 'to.params.data:', to.params.data);
    MainStore.datafetchRunning = false;
    return;
  }

  if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch, after geocode, GeocodeStore.aisData:', GeocodeStore.aisData);
  
  // if the topic is condos and the address changes and there are no condos, reroute to property
  if (to.params.topic == "condos" && !CondosStore.condosData.pages.page_1.features.length) {
    MainStore.currentTopic = "property";
    router.push({ name: 'address-and-topic', params: { address: to.params.address, topic: 'property' } });
    MainStore.datafetchRunning = false;
    return;
  }

  MainStore.lastSearchMethod = null;
  MainStore.datafetchRunning = false;

  if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch, to.name:', to.name, 'to.params.topic:', to.params.topic, 'to.params.data:', to.params.data);

  if (to.name !== 'topic') {
    await topicDataFetch(to.params.topic, to.params.data);
    if (to.params.topic) {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('dataFetch, adding to dataSourcesLoadedArray:', to.params.topic.toLowerCase());
      MainStore.addToDataSourcesLoadedArray(to.params.topic.toLowerCase());
    }
  }
}

const topicDataFetch = async (topic, data) => {
  if (import.meta.env.VITE_DEBUG == 'true') console.log('topicDataFetch is running, topic:', topic);
  
  if (topic && topic.toLowerCase() === 'elections-and-ballots') {
    const BallotsStore = useBallotsStore();
    await BallotsStore.fillAllBallotsData();
    BallotsStore.loadingBallotsData = false;
  }

  if (topic && topic.toLowerCase() === 'polling-place') {
    const PollingPlaceStore = usePollingPlaceStore();
    await PollingPlaceStore.fillAllPollingPlaceData();
    PollingPlaceStore.loadingPollingPlaceData = false;
  }

  if (topic && topic.toLowerCase() === 'vote-by-mail') {
    const VoteByMailStore = useVoteByMailStore();
    await VoteByMailStore.fillVotingSites();
    VoteByMailStore.loadingData = false;
  }

  if (topic && topic.toLowerCase() === 'elected-officials') {
    const ElectedOfficialsStore = useElectedOfficialsStore();
    await ElectedOfficialsStore.fillAllElectedOfficialsData();
    ElectedOfficialsStore.loadingElectedOfficialsData = false;
  }

}

const router = createRouter({
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/components/NotFound.vue')
    },
    {
      path: '/',
      name: 'home',
      component: App,
      props: true,
    },
    {
      path: '/:addressOrTopic',
      name: 'address-or-topic',
      component: App,
      beforeEnter: async (to, from) => {
        if (import.meta.env.VITE_DEBUG === 'true') console.log('address-or-topic route beforeEnter, to:', to, 'from:', from, to.params.addressOrTopic.toLowerCase());
        const MainStore = useMainStore();
        const topics = [ 'elections-and-ballots', 'polling-place', 'vote-by-mail', 'elected-officials' ];
        if (topics.includes(to.params.addressOrTopic.toLowerCase())) {
          if (import.meta.env.VITE_DEBUG === 'true') console.log('inside if, routing to topic');
          MainStore.currentTopic = to.params.addressOrTopic;
          MainStore.currentAddress = null;
          to.query.lang ? MainStore.currentLang = to.query.lang : MainStore.currentLang = 'en-us';
          routeApp(router);
        } else {
          if (import.meta.env.VITE_DEBUG === 'true') console.log('inside else, routing to address');
          MainStore.currentTopic = null;
          MainStore.currentAddress = to.params.addressOrTopic;
          to.query.lang ? MainStore.currentLang = to.query.lang : MainStore.currentLang = 'en-us';
          routeApp(router);
        }
      }
    },
    {
      path: '/:address',
      name: 'address',
      component: App,
      beforeEnter: async (to, from) => {
        console.log('address route beforeEnter, to:', to, 'from:', from);
      }
    },
    {
      path: '/:topic',
      name: 'topic',
      component: App,
      beforeEnter: async (to, from) => {
        console.log('topic route beforeEnter, to:', to, 'from:', from);
      }
    },
    {
      path: '/:address/:topic',
      name: 'address-and-topic',
      component: App,
    },
    {
      path: '/:address/:topic/:data',
      name: 'address-topic-and-data',
      component: App,
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: App,
    },
    {
      path: '/search',
      name: 'search',
      component: App,
      beforeEnter: async (to, from) => {
        const { address, lat, lng, lang } = to.query;
        if (import.meta.env.VITE_DEBUG == 'true') console.log('search route beforeEnter, to.query:', to.query, 'to:', to, 'from:', from, 'address:', address);
        const MainStore = useMainStore();
        const GeocodeStore = useGeocodeStore();
        const ParcelsStore = useParcelsStore();
        MainStore.addressSearchRunning = true;
        if (MainStore.datafetchRunning) {
          return false;
        } else if (address && address !== '') {
          if (import.meta.env.VITE_DEBUG == 'true') console.log('search route beforeEnter, address:', address);
          MainStore.setLastSearchMethod('address');
          await clearStoreData();
          await getGeocodeAndPutInStore(address);
          if (!GeocodeStore.aisData.features) {
            MainStore.currentTopic = null;
          }
          routeApp(router);
        } else if (lat && lng) {
          MainStore.setLastSearchMethod('mapClick');
          await getParcelsAndPutInStore(lng, lat);
          if (!Object.keys(ParcelsStore.pwdChecked).length && !Object.keys(ParcelsStore.dorChecked).length) {
            MainStore.addressSearchRunning = false;
            return false;
          }
          await checkParcelInAis();
          routeApp(router);
        } else {
          return false;
        }
      },
    }
  ]
})

router.afterEach(async (to, from) => {
  const MainStore = useMainStore();
  if (import.meta.env.VITE_DEBUG == 'true') console.log('router afterEach to:', to, 'from:', from);
  if (!to.query.lang) {
    MainStore.currentLang = 'en-us';
  } else if (to.query.lang !== from.query.lang) {
    MainStore.currentLang = to.query.lang;
  }
  if (to.name === 'address-or-topic' || to.name === 'address') {
    return;
  } else if (to.name !== 'not-found' && to.name !== 'search' && to.name !== 'topic') {
    MainStore.addressSearchRunning = false;
    await dataFetch(to, from);
    // let pageTitle = 'VoterHub';
    let pageTitle = i18nFromFiles.i18n.data.messages[MainStore.currentLang].app.title;
    for (let param of Object.keys(to.params)) {
      if (param === 'topic') {
        pageTitle += ' | ' + i18nFromFiles.i18n.data.messages[MainStore.currentLang].topics[to.params[param]];
      } else {
        pageTitle += ' | ' + to.params[param];
      }
    }
    MainStore.pageTitle = pageTitle;
  } else if (to.name == 'not-found') {
    const MainStore = useMainStore();
    MainStore.currentTopic = "elections-and-ballots"
  }
  console.log('router afterEach, to.name:', to.name);
});

export default router
