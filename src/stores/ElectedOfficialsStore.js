import { defineStore } from 'pinia';
import { useGeocodeStore } from '@/stores/GeocodeStore.js'

export const useElectedOfficialsStore = defineStore("ElectedOfficialsStore", {
  state: () => {
    return {
      electedOfficials: {},
      loadingElectedOfficialsData: true,
    };
  },
  actions: {
    async fillAllElectedOfficialsData() {
      this.fillElectedOfficials();
    },
    async clearAllElectedOfficialsData() {
      this.electedOfficials = {};
    },
    async fillElectedOfficials() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillElectedOfficials is running');
      const GeocodeStore = useGeocodeStore();
      const feature = GeocodeStore.aisData.features[0];
      let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
      const url = baseUrl += `WITH split AS (SELECT * FROM splits WHERE precinct = '${feature.properties.election_precinct}') \
      SELECT eo.*, s.ballot_file_id\
      FROM elected_officials eo, split s \
      WHERE eo.office = 'city_council' AND eo.district = '${feature.properties.council_district_2024}' \
                OR eo.office = 'state_house' AND eo.district = s.state_house \
                OR eo.office = 'state_senate' AND eo.district = s.state_senate \
                OR eo.office = 'us_house' AND eo.district = s.federal_house \
                OR eo.office != 'city_council' AND eo.office != 'state_house' AND eo.office != 'state_senate' AND eo.office != 'us_house' \
      `;
      const response = await fetch(url);
      this.electedOfficials = await response.json();
    },
  },
});