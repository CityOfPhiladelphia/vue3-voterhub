import axios from 'axios';

import { defineStore } from 'pinia';
import { useGeocodeStore } from './GeocodeStore';

const evaluateParams = (feature, dataSource) => {
  const params = {};
  if (!dataSource.options.params) {
    return params; 
  }
  // if (import.meta.env.VITE_DEBUG == 'true') console.log("dataSource: ", dataSource);
  const paramEntries = Object.entries(dataSource.options.params);

  for (let [ key, valOrGetter ] of paramEntries) {
    let val;

    if (typeof valOrGetter === 'function') {
      val = valOrGetter(feature);
    } else {
      val = valOrGetter;
    }
    params[key] = val;
  }
  // if (import.meta.env.VITE_DEBUG == 'true') console.log("params: ", params)
  return params;
}

// this was the fetch function from @phila/vue-datafetch http-client.js
const fetchNearby = (feature, dataSource) => {
  const params = evaluateParams(feature, dataSource);
  const options = dataSource.options;
  // const srid = options.srid || 4326;
  const table = options.table;
  // TODO generalize these options into something like a `sql` param that
  // returns a sql statement
  const dateMinNum = options.dateMinNum || null;
  const dateMinType = options.dateMinType || null;
  // if (import.meta.env.VITE_DEBUG == 'true') console.log('dateMinType:', dateMinType);
  const dateField = options.dateField || null;
  const distances = options.distances || 250;
  // if (import.meta.env.VITE_DEBUG == 'true') console.log('fetchNearby distances:', distances);
  const extraWhere = options.where || null;

  const groupby = options.groupby || null;

  const distQuery = "ST_Distance(the_geom::geography, ST_SetSRID(ST_Point("
                  + feature.geometry.coordinates[0]
                  + "," + feature.geometry.coordinates[1]
                  + "),4326)::geography)";

  const latQuery = "ST_Y(the_geom)";
  const lngQuery = "ST_X(the_geom)";

  let select;
  
  if (!groupby) {
    select = '*';
  } else {
    select = groupby + ', the_geom';
  }
  // if (calculateDistance) {
  select = select + ", " + distQuery + 'as distance,' + latQuery + 'as lat, ' + lngQuery + 'as lng';
  // }

  params['q'] = "select " + select + " from " + table + " where " + distQuery + " < " + distances;

  let subFn;
  if (dateMinNum) {
    // let subFn, addFn;
    switch (dateMinType) {
    case 'hour':
      subFn = subHours;
      break;
    case 'day':
      subFn = subDays;
      break;
    case 'week':
      subFn = subWeeks;
      break;
    case 'month':
      subFn = subMonths;
      break;
    case 'year':
      subFn = subYears;
      break;
    }

    // let test = format(subFn(new Date(), dateMinNum), 'YYYY-MM-DD');
    params['q'] = params['q'] + " and " + dateField + " > '" + format(subFn(new Date(), dateMinNum), 'yyyy-MM-dd') + "'";
  }

  if (extraWhere) {
    params['q'] = params['q'] + " and " + extraWhere;
  }

  if (groupby) {
    params['q'] = params['q'] + " group by " + groupby + ", the_geom";
  }
  return params
}

export const useVoteByMailStore = defineStore("VoteByMailStore", {
  state: () => {
    return {
      locationsDataError: false,
      datesDataError: false,
      voteByMail: {},
      loadingData: true,
      dataFields: {
        voteByMail: {
          title: 'Vote by Mail Sites',
          id_field: 'cartodb_id',
          info_field: 'location'
        },
      },
      importantDates: {},
    };
  },
  actions: {
    setLoadingData(loading) {
      this.loadingData = loading;
    },
    setDataError(error) {
      this.dataError = error;
    },
    async clearAllVoteByMailData() {
      this.dataError = false;
      this.loadingData = true;
      this.voteByMail = {};
      this.importantDates = {};
    },
    async fillVotingSites() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillVotingSites is running');
      try {
        const GeocodeStore = useGeocodeStore();
        this.setLoadingData(true);
        
        let dataSource = {
          url: 'https://phl.carto.com:443/api/v2/sql?',
          options: {
            table: 'mail_ballot_dropoff_locations',
            distances: 35000,
          },
        };
        
        let feature, params;
        if (GeocodeStore.aisData.features) {
          feature = GeocodeStore.aisData.features[0];
          params = fetchNearby(feature, dataSource);
        } else {
          params = {'q': 'select * from mail_ballot_dropoff_locations'}
        }
        
        console.log('fillVotingSites params:', params);
        const response = await axios.get(dataSource.url, { params });
        if (response.status === 200) {
          const data = response.data;
          data.rows.forEach(row => {
            row.distance_miles = (row.distance * 0.000621371).toFixed(2) + ' miles';
            row.name_and_address = `<a target="_blank" href="https://www.google.com/maps/place/${row.address}+Philadelphia,+PA+${row.zip_code}">${row.location}</a><br/>
              ${row.address}<br/>Philadelphia, PA ${row.zip_code}`;
            row.type_and_hours = '';
            // if (row.type === 'Dropbox') {
            //   row.type_and_hours = `Mail ballot drop box: Available 24/7 until 8:00 p.m. on ${row.date_close}`
            // } else if (row.type === 'Election Office') {
            //   row.type_and_hours = "Election Office: Open Monday to Friday 9:00 a.m. to 5:00 p.m. and Saturday to Sunday 10:00 a.m. to 4:00 p.m.  On election day, open 7:00 a.m. to 8:00 p.m."
            // } else if (row.type === 'Satellite Election Office') {
            //   row.type_and_hours = "Satellite Office: Open Monday to Friday 10:00 a.m. to 6:00 p.m. and Saturday to Sunday 10:00 a.m. to 4:00 p.m.  On election day, open 7:00 a.m. to 8:00 p.m."
            // }
          });
          this.voteByMail = data;
          this.setLoadingData(false);
        } else {
          this.setDataError(true);
          if (import.meta.env.VITE_DEBUG == 'true') console.warn('voteByMail - await resolved but HTTP status was not successful');
        }
      } catch {
        this.setDataError(true);
        if (import.meta.env.VITE_DEBUG == 'true') console.error('voteByMail - await never resolved, failed to fetch address data');
      }
    },
    async fillImportantDates() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillImportantDates is running');
      try {
        let baseUrl = 'https://phl.carto.com/api/v2/sql?q=';
        const url = baseUrl += `SELECT * FROM important_dates_elections WHERE impacted_body = 'Mail-In Voting'`;
        const response = await fetch(url);

        if (response.ok) {
          let data = await response.json();
          console.log('response:', response, 'data:', data);
          for (let row of data.rows) {
            row.date = new Date(row.event_date);
          }
          this.importantDates = data.rows.filter(row => {
            let now = new Date();
            let today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
            console.log('row.date:', row.date, 'today:', today);
            return new Date(row.date_english) >= today;
          });
        } else {
          if (import.meta.env.VITE_DEBUG == 'true') console.warn('important dates - await resolved but HTTP status was not successful');
        }
      } catch {
        this.dataError = true;
        if (import.meta.env.VITE_DEBUG == 'true') console.error('important dates - await never resolved, failed to fetch address data');
      }
    },
  },
});