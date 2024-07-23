<script setup>

import useTransforms from '@/composables/useTransforms';
const { titleCase } = useTransforms();

import { usePollingPlaceStore } from '@/stores/PollingPlaceStore';
import { computed, getCurrentInstance } from 'vue';
const PollingPlaceStore = usePollingPlaceStore();

import VerticalTable from '@/components/VerticalTable.vue';

const instance = getCurrentInstance();
// const locale = computed(() => instance.appContext.config.globalProperties.$i18n.locale);

import i18nFromFiles from '@/i18n/i18n.js';
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[instance.appContext.config.globalProperties.$i18n.locale];
})
if (import.meta.env.VITE_DEBUG == 'true') console.log('messages.value:', messages.value);


const accessibility = computed(() => {
  if (PollingPlaceStore.pollingPlaces.rows && PollingPlaceStore.pollingPlaces.rows.length) {
    const code = PollingPlaceStore.pollingPlaces.rows[0].accessibility_code;
    const answer = code== "F" ? 'buildingFullyAccessible' :
      code== "B" ? 'buildingSubstantiallyAccessible' :
      code== "M" ? 'buildingAccessibilityModified' :
      code== "A" ? 'alternateEntrance' :
      code== "R" ? 'buildingAccessibleWithRamp' :
      code== "N" ? 'buildingNotAccessible' :
      'informationNotAvailable';
    return answer;
  }
});

const parking = computed(() => {
  if (PollingPlaceStore.pollingPlaces.rows && PollingPlaceStore.pollingPlaces.rows.length) {
    const code = PollingPlaceStore.pollingPlaces.rows[0].parking_info;
    const parking = code == "N" ? 'noParking' :
      code == "G" ? 'generalParking' :
      code == "L" ? 'loadingZone' :
      'informationNotAvailable';
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
        value: messages.value.default.introPage.p4,
        // value: 'All polling places will be open on election day from 7 a.m. to 8 p.m.'
      },
      {
        label: 'Accessibility',
        value: `<a target="_blank" href="https://vote.phila.gov/voting/voting-at-the-polls/polling-place-accessibility/">${messages.value.pollingPlace.topic.accessibilityCodes[accessibility.value]}</a>`,
      },
      {
        label: 'Parking',
        value: messages.value.pollingPlace.topic.parkingCodes[parking.value],
      },
      {
        label: 'Last Updated',
        value: 'This has been the polling place for this division since',
      },
    ];
  }
});

</script>

<template>

  <h2 class="subtitle is-5 vert-table-title">
    Polling Place
  </h2>
  <font-awesome-icon
    v-if="PollingPlaceStore.loadingPollingPlaceData"
    icon="fa-solid fa-spinner"
    spin
  />
  <vertical-table
    :table-id="'pollingPlaceTable'"
    :data="pollingPlaceData"
  />
  <a
    class="table-link"
    target="_blank"
    :href="`https://vote.phila.gov/voting/vote-by-mail/`"
  >{{ $t('pollingPlace.topic.verticalTable1.link') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>

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