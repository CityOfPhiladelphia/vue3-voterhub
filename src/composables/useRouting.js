import { useMainStore } from '@/stores/MainStore';

export default function useRouting() {

  const routeApp = (router) => {
    if (import.meta.env.VITE_DEBUG == 'true') console.log('routeApp')

    const MainStore = useMainStore();
    if (!MainStore.currentAddress && MainStore.currentTopic){
      if (MainStore.currentLang) {
        router.push({ name: 'topic', params: { topic: MainStore.currentTopic }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'topic', params: { topic: MainStore.currentTopic } });
      }
    } else if (MainStore.currentAddress && MainStore.currentTopic) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address-and-topic because MainStore has address and topic');
      if (MainStore.currentLang) {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: MainStore.currentTopic }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address-and-topic', params: { address: MainStore.currentAddress, topic: MainStore.currentTopic } });
      }
    } else if (MainStore.currentAddress) {
      if (import.meta.env.VITE_DEBUG) console.log('routeApp routing to address because MainStore has address');
      if (MainStore.currentLang) {
        router.push({ name: 'address', params: { address: MainStore.currentAddress }, query: { lang: MainStore.currentLang } });
      } else {
        router.push({ name: 'address', params: { address: MainStore.currentAddress } });
      }
    } else {
      router.push({ name: 'not-found' });
    }
  }
  return {
    routeApp
  }
}