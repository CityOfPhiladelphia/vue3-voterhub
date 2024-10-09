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
      dataError: false,
      voteByMail: {},
      loadingData: true,
      dataFields: {
        voteByMail: {
          title: 'Vote by Mail Sites',
          id_field: 'cartodb_id',
          info_field: 'site_name'
        },
      },
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
    },
    async fillVotingSites() {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillVotingSites is running');
      try {
        const GeocodeStore = useGeocodeStore();
        this.setLoadingData(true);
        
        let dataSource = {
          url: 'https://phl.carto.com:443/api/v2/sql?',
          options: {
            table: 'voting_sites',
            distances: 35000,
          },
        };
        
        let feature, params;
        if (GeocodeStore.aisData.features) {
          feature = GeocodeStore.aisData.features[0];
          params = fetchNearby(feature, dataSource);
        } else {
          params = {'q': 'select * from voting_sites'}
        }
        
        console.log('fillVotingSites params:', params);
        const response = await axios.get(dataSource.url, { params });
        if (response.status === 200) {
          const data = response.data;
          data.rows.forEach(row => {
            row.distance_miles = (row.distance * 0.000621371).toFixed(2) + ' miles';
            row.name_and_address = row.site_name+'<br/>'+row.street_address+'<br/>Philadelphia, PA '+row.zip;
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
  },
});