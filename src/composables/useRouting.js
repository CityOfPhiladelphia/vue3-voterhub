import { useMainStore } from '@/stores/MainStore';
import { useParcelsStore } from '@/stores/ParcelsStore';
import slugify from 'slugify';

// import { computed, getCurrentInstance } from 'vue';

export default function useRouting() {

  const routeApp = (router) => {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('routeApp')

    const MainStore = useMainStore();
    const ParcelsStore = useParcelsStore();
    if (MainStore.currentAddress && MainStore.currentTopic == 'Nearby Activity') {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-topic-and-data');
      router.push({ name: 'address-topic-and-data', params: { address: MainStore.currentAddress, topic: slugify("Nearby Activity"), data: MainStore.currentNearbyDataType || 'nearby311' } });
    } else if (!MainStore.currentAddress && MainStore.currentTopic){
      if (MainStore.currentLang) {
        router.push({ name: 'topic', params: { topic: slugify(MainStore.currentTopic) }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'topic', params: { topic: slugify(MainStore.currentTopic) } });
      }
    } else if (MainStore.currentAddress && MainStore.currentTopic) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-and-topic because MainStore has address and topic');
      if (MainStore.currentLang) {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: slugify(MainStore.currentTopic) }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: slugify(MainStore.currentTopic) } });
      }
    } else if (MainStore.currentAddress) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address because MainStore has address');
      if (MainStore.currentLang) {
        router.push({ name: 'address', params: { address: MainStore.currentAddress }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address', params: { address: MainStore.currentAddress } });
      }
    } else if (MainStore.lastSearchMethod == 'mapClick' && ParcelsStore.pwd.features && ParcelsStore.pwd.features.length > 0) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-and-topic because ParcelsStore has pwd features');
      router.push({ name: 'address-and-topic', params: { address: ParcelsStore.pwd.features[0].properties.ADDRESS, topic: slugify(MainStore.currentTopic) } })
    } else {
      router.push({ name: 'not-found' });
    }
  }
  return {
    routeApp
  }
}