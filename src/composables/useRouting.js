import { useMainStore } from '@/stores/MainStore';

export default function useRouting() {
  const routeApp = (router) => {
    if (import.meta.env.VITE_DEBUG) console.log('routeApp')
    
    const MainStore = useMainStore();
    if (!MainStore.currentAddress && MainStore.currentTopic == 'voting'){
      if (MainStore.currentLang) {
        router.replace({ name: 'topic', params: { topic: MainStore.currentTopic }, query: { lang: MainStore.currentLang } });
      } else {
        router.replace({ name: 'topic', params: { topic: MainStore.currentTopic } });
      }
    } else if (MainStore.currentAddress && MainStore.currentTopic == 'nearby') {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-topic-and-data');
      router.push({ name: 'address-topic-and-data', params: { address: MainStore.currentAddress, topic: "nearby", data: MainStore.currentNearbyDataType || '311' } });
    } else if (MainStore.currentAddress && MainStore.currentTopic) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-and-topic because MainStore has address and topic');
      router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: MainStore.currentTopic } });
    } else if (MainStore.currentAddress) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address because MainStore has address');
      router.push({ name: 'address', params: { address: MainStore.currentAddress } });
    } else {
      MainStore.addressSearchRunning = false;
      router.push({ name: 'not-found' });
    }
  }
  return {
    routeApp
  }
}