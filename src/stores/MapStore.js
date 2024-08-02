import { defineStore } from 'pinia';
import proj4 from 'proj4';
import axios from 'axios';

export const useMapStore = defineStore("MapStore", {
  state: () => {
    return {
      map: {},
      currentMapStyle: 'pwdDrawnMapStyle',
      currentAddressCoords: [],
      // currentTopicMapStyle: {},
      bufferForAddress: {},
      currentMarkersForTopic: [],
      addressMarker: null,
      addressParcel: null,
      initialized: false,
      draw: null,
      imageryOn: false,
      imagerySelected: '2023',
      cyclomediaOn: false,
      cyclomediaInitialized: false,
      cyclomediaRecordingsOn: false,
      cyclomediaCameraYaw: null,
      cyclomediaCameraHFov: null,
      cyclomediaCameraXyz: null,
      cyclomediaCameraLngLat: null,
      cyclomediaYear: null,
      clickedCyclomediaRecordingCoords: null,
      eagleviewOn: false,
      selectedRegmap: null,
      regmapOpacity: 0.5,
      zoningOpacity: 1,
      stormwaterOpacity: 1,
      labelLayers: [],
    };
  },
  actions: {
    setCyclomediaCameraYaw(yaw) {
      this.cyclomediaCameraYaw = yaw;
    },
    setCyclomediaCameraLngLat(lngLat, xyz) {
      this.cyclomediaCameraXyz = xyz;
      this.cyclomediaCameraLngLat = lngLat;
    },
    setMap(map) {
      if (import.meta.env.VITE_DEBUG == 'true') console.log('MapStore.setMap is running, map:', map);
      this.map = map;
    },
    setMapStyle(style) {
      this.currentMapStyle = style;
    },
    async fillBufferForAddress(lng, lat) {
      const projection4326 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
      const projection2272 = "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
      const distances = 700;

      const coords2272 = proj4(projection4326, projection2272, [ lng, lat ]);

      if (import.meta.env.VITE_DEBUG == 'true') console.log('fillBufferForAddress is running, lng:', lng, 'lat:', lat);
      const bufferUrl = 'https://citygeo-geocoder-pub.databridge.phila.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer/buffer';

      const params = {
        geometries: `${coords2272.join(', ')}`,
        inSR: 2272,
        outSR: 4326,
        bufferSR: 2272,
        distances: distances, //|| 0.0028,
        unionResults: true,
        geodesic: false,
        f: 'json',
      };

      let response = await axios.get(bufferUrl, { params });
      if (import.meta.env.VITE_DEBUG == 'true') console.log('response:', response);
      for (let [index, point] of response.data.geometries[0].rings[0].entries()) {
        if (index % 2 === 0 || index % 3 === 0) {
          response.data.geometries[0].rings[0].splice(index, 1);
        }
      }
      response.data.geometries[0].rings[0].push(response.data.geometries[0].rings[0][0]);

      this.bufferForAddress = response.data;
    }
  },

});