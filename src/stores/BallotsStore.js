import { defineStore } from 'pinia';
import { useGeocodeStore } from './GeocodeStore';

export const useBallotsStore = defineStore("BallotsStore", {
  state: () => {
    return {
      electedOfficials: {},
      nextElection: {},
      loadingBallotsData: true,
    };
  },
  actions: {
    async fillAllBallotsData() {
      this.fillElectedOfficials();
      this.fillNextElection();
    },
    async clearAllBallotsData() {
      this.electedOfficials = {};
      this.nextElection = {};
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
      `;
      const response = await fetch(url);
      this.electedOfficials = await response.json();
    },
    async fillNextElection() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillNextElection is running');
      const url = 'https://admin-vote.phila.gov/wp-json/votes/v1/election';
      const response = await fetch(url);
      this.nextElection = await response.json();
    }
  },
});
