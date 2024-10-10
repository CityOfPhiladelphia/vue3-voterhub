import { useMainStore } from '@/stores/MainStore';

export default function useRouting() {

  const routeApp = (router) => {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('routeApp')

    const MainStore = useMainStore();
    if (!MainStore.currentAddress && MainStore.currentTopic){
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to topic because MainStore.currentTopic:', MainStore.currentTopic);
      if (MainStore.currentLang != 'en-us') {
        router.replace({ name: 'topic', params: { topic: MainStore.currentTopic }, query: { lang: MainStore.currentLang } });
      } else {
        router.replace({ name: 'topic', params: { topic: MainStore.currentTopic } });
      }
    } else if (MainStore.currentAddress && MainStore.currentTopic) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-and-topic because MainStore has address and topic');
      if (MainStore.currentLang != 'en-us') {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: MainStore.currentTopic }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: MainStore.currentTopic } });
      }
    } else if (MainStore.currentAddress) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address because MainStore has address');
      if (MainStore.currentLang != 'en-us') {
        router.push({ name: 'address', params: { address: MainStore.currentAddress }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address', params: { address: MainStore.currentAddress } });
      }
    } else {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to not-found because no address or topic');
      MainStore.addressSearchRunning = false;
      router.push({ name: 'not-found' });
    }
  }
  return {
    routeApp
  }
}