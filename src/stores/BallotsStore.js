import { defineStore } from 'pinia';
import { useGeocodeStore } from './GeocodeStore';

export const useBallotsStore = defineStore("BallotsStore", {
  state: () => {
    return {
      electedOfficials: {},
      nextElection: {},
      electionSplit: {},
      importantDates: {},
      loadingBallotsData: true,
    };
  },
  actions: {
    async fillAllBallotsData() {
      this.fillElectedOfficials();
      this.fillElectionSplit();
      this.fillNextElection();
      this.fillImportantDates();
    },
    async clearAllBallotsData() {
      this.electedOfficials = {};
      this.nextElection = {};
      this.electionSplit = {};
      this.importantDates = {};
      this.loadingBallotsData = true;
    },
    async fillElectionSplit() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillElectionSplit is running');
      const GeocodeStore = useGeocodeStore();
      const feature = GeocodeStore.aisData.features[0];
      let precinct;
      if (feature.properties.election_precinct) {
        precinct = feature.properties.election_precinct;
      } else if (feature.properties.political_division) {
        precinct = feature.properties.political_division;
      }
      let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
      const url = baseUrl += `SELECT * FROM splits WHERE precinct = '${precinct}'`;
      // const url = baseUrl += `select ST_X(the_geom) as lng, ST_Y(the_geom) as lat, * from polling_places where precinct ='${feature.properties.election_precinct}'`;
      const response = await fetch(url);
      this.electionSplit = await response.json();
    },
    async fillElectedOfficials() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillElectedOfficials is running');
      const GeocodeStore = useGeocodeStore();
      const feature = GeocodeStore.aisData.features[0];
      let precinct;
      if (feature.properties.election_precinct) {
        precinct = feature.properties.election_precinct;
      } else if (feature.properties.political_division) {
        precinct = feature.properties.political_division;
      }
      let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
      const url = baseUrl += `WITH split AS (SELECT * FROM splits WHERE precinct = '${precinct}') \
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
    },
    async fillImportantDates() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillImportantDates is running');
      let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
      const url = baseUrl += `SELECT * FROM voting_important_dates_2024 WHERE impacted_body = 'Voters'`;
      const response = await fetch(url);
      let data = await response.json();
      console.log('response:', response, 'data:', data);
      for (let row of data.rows) {
        row.date = new Date(row.event_date);
      }
      this.importantDates = data.rows.filter(row => {
        let now = new Date();
        let today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        console.log('row.date:', row.date, 'today:', today);
        return row.date >= today;
      });
    },
  },
});
