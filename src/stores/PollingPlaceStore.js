import axios from 'axios';

import { defineStore } from 'pinia';
import { useGeocodeStore } from '@/stores/GeocodeStore.js'

export const usePollingPlaceStore = defineStore("PollingPlaceStore", {
  state: () => {
    return {
      divisions: {},
      pollingPlaces: {},
      loadingPollingPlaceData: true,
    };
  },
  actions: {
    async fillAllPollingPlaceData() {
      this.fillDivisions();
      this.fillPollingPlaces();
    },
    async clearAllPollingPlaceData() {
      this.loadingPollingPlaceData = true;
      this.divisions = {};
      this.pollingPlaces = {};
    },
    async fillDivisions() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillDivisions is running');
      const GeocodeStore = useGeocodeStore();
      const feature = GeocodeStore.aisData.features[0];
      let url = '//services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Political_Divisions/FeatureServer/0/query';

      let params = {
        'returnGeometry': true,
        'where': "1=1",
        'outSR': 4326,
        'outFields': '*',
        'inSr': 4326,
        'geometryType': 'esriGeometryPoint',
        'spatialRel': 'esriSpatialRelWithin',
        'f': 'geojson',
        'geometry': JSON.stringify({ "x": feature.geometry.coordinates[0], "y": feature.geometry.coordinates[1], "spatialReference": { "wkid": 4326 }}),
      };

      const response = await axios.get(url, { params });
      this.divisions = await response.data;
    },
    async fillPollingPlaces() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillPollingPlaces is running');
      const GeocodeStore = useGeocodeStore();
      const feature = GeocodeStore.aisData.features[0];
      let precinct;
      if (feature.properties.election_precinct) {
        precinct = feature.properties.election_precinct;
      } else if (feature.properties.political_division) {
        precinct = feature.properties.political_division;
      }
      let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
      const url = baseUrl += `select ST_X(the_geom) as lng, ST_Y(the_geom) as lat, * from polling_places where precinct ='${precinct}'`;
      const response = await fetch(url);
      this.pollingPlaces = await response.json();
    },
  },
});
