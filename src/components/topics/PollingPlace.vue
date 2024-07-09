<script setup>

import useTransforms from '@/composables/useTransforms';
const { titleCase } = useTransforms();

import { usePollingPlaceStore } from '@/stores/PollingPlaceStore';
import { computed } from 'vue';
const PollingPlaceStore = usePollingPlaceStore();

import VerticalTable from '@/components/VerticalTable.vue';

const accessibility = computed(() => {
  if (PollingPlaceStore.pollingPlaces.rows && PollingPlaceStore.pollingPlaces.rows.length) {
    const code = PollingPlaceStore.pollingPlaces.rows[0].accessibility_code;
    const answer = code== "F" ? 'Building Fully Accessible' :
      code== "B" ? 'Building Substantially Accessible' :
      code== "M" ? 'Building Accessibility Modified' :
      code== "A" ? 'Alternate Entrance' :
      code== "R" ? 'Building Accessible With Ramp' :
      code== "N" ? 'Building Not Accessible' :
      'Information Not Available';
    return answer;
  }
});

const parking = computed(() => {
  if (PollingPlaceStore.pollingPlaces.rows && PollingPlaceStore.pollingPlaces.rows.length) {
    const code = PollingPlaceStore.pollingPlaces.rows[0].parking_info;
    const parking = code == "N" ? 'No Parking' :
      code == "G" ? 'General Parking' :
      code == "L" ? 'Loading Zone' :
      'Information Not Available';
    return parking;
  }
});

const pollingPlaceData = computed(() => {
  if (PollingPlaceStore.pollingPlaces.rows && PollingPlaceStore.pollingPlaces.rows.length) {
    return [
      {
        label: 'Location',
        value: '<b>Ward ' + PollingPlaceStore.pollingPlaces.rows[0].ward + ', Division ' + PollingPlaceStore.pollingPlaces.rows[0].division + '</b><br>' +
            titleCase(PollingPlaceStore.pollingPlaces.rows[0].placename) + '<br>' +
            titleCase(PollingPlaceStore.pollingPlaces.rows[0].street_address)
      },
      {
        label: 'Hours',
        value: 'All polling places will be open on election day from 7 a.m. to 8 p.m.'
      },
      {
        label: 'Accessibility',
        value: `<a target="_blank" href="https://vote.phila.gov/voting/voting-at-the-polls/polling-place-accessibility/">${accessibility.value}</a>`,
      },
      {
        label: 'Parking',
        value: parking.value,
      },
    ];
  }
});

</script>

<template>

  <h5 class="subtitle is-5 table-title">
    Polling Place
  </h5>
  <vertical-table
    :table-id="'pollingPlaceTable'"
    :data="pollingPlaceData"
  />

</template>

<style scoped>

.badge-title {
  padding-top: 0.25rem !important;
  height: 2rem;
  color: white;
  border-width: 1px;
  border-style: solid;
  border-color: white;
  background-color: rgb(68, 68, 68);
}

.election {
  font-size: 2rem;
  background-color: #f0f0f0;
  border-width: 1px;
  border-style: solid;
  border-color: white;
}

</style>