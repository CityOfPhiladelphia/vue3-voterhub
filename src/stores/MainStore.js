import { defineStore } from 'pinia';

export const useMainStore = defineStore("MainStore", {
  state: () => {
    return {
      datafetchRunning: false,
      publicPath: null,
      isMobileDevice: null,
      isMac: null,
      lastSearchMethod: 'address',
      addressSearchValue: '',
      lastClickCoords: [0,0],
      currentParcelGeocodeParameter: '',
      otherParcelGeocodeParameter: '',
      currentParcelAddress:'',
      otherParcelAddress:'',
      currentAddress: '',
      currentTopic: 'elections-and-ballots',
      currentLang: null,
      currentNearbyDataType: null,
      currentNearbyTimeInterval: {},
      dataSourcesLoadedArray: [],
      clickedRow: [],
      clickedMarkerId: null,
      hoveredStateId: null,
      selectedParcelId: null,
      fullScreenMapEnabled: false,
      fullScreenTopicsEnabled: false,
      windowDimensions: {},
    };
  },

  actions: {
    setCurrentAddress(address) {
      this.currentAddress = address;
    },
    setCurrentGeocodeParameter(value) {
      this.currentGeocodeParameter = value;
    },
    setLastSearchMethod(searchMethod) {
      this.lastSearchMethod = searchMethod;
    },
    setCurrentNearbyDataType(data) {
      this.currentNearbyDataType = data;
    },
    clearDataSourcesLoadedArray() {
      this.dataSourcesLoadedArray = [];
    },
    addToDataSourcesLoadedArray(data) {
      this.dataSourcesLoadedArray.push(data);
    },
  },
});