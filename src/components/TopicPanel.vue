<script setup>
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n() 

import { computed } from 'vue';
import { useMainStore } from '@/stores/MainStore.js'
const GeocodeStore = useGeocodeStore();
import { useGeocodeStore } from '@/stores/GeocodeStore.js'
const MainStore = useMainStore();

import FullScreenTopicsToggleTab from '@/components/FullScreenTopicsToggleTab.vue';
import AddressSearchControl from '@/components/AddressSearchControl.vue';

import Topic from '@/components/Topic.vue';
import DefaultIntro from '@/components/intros/DefaultIntro.vue';
import Ballots from '@/components/topics/Ballots.vue';
import BallotsIntro from '@/components/intros/BallotsIntro.vue';
import PollingPlace from '@/components/topics/PollingPlace.vue';
import PollingPlaceIntro from '@/components/intros/PollingPlaceIntro.vue';
import VoteByMail from '@/components/topics/VoteByMail.vue';
import VoteByMailIntro from '@/components/intros/VoteByMailIntro.vue';
import ElectedOfficials from '@/components/topics/ElectedOfficials.vue';
import ElectedOfficialsIntro from '@/components/intros/ElectedOfficialsIntro.vue';

import { useRoute } from 'vue-router';

const route = useRoute();

const address = computed(() => MainStore.currentAddress);
const dataSourcesLoadedArray = computed(() => MainStore.dataSourcesLoadedArray);

const zipCode = computed(() => {
  if (GeocodeStore.aisData && GeocodeStore.aisData.features) {
    return GeocodeStore.aisData.features[0].properties.zip_code + '-' + GeocodeStore.aisData.features[0].properties.zip_4;
  }
  return '';
});

</script>

<template>
  <full-screen-topics-toggle-tab
    v-show="!MainStore.fullScreenMapEnabled"
  />
      
  <!-- FRONT PAGE CONTENT -->
  <DefaultIntro v-if="route.name == 'home'" />
  <BallotsIntro v-if="route.name == 'topic' && route.params.topic.toLowerCase() == 'elections-and-ballots'" />
  <PollingPlaceIntro v-if="route.name == 'topic' && route.params.topic.toLowerCase() == 'polling-place'" />
  <VoteByMailIntro v-if="route.name == 'topic' && route.params.topic.toLowerCase() == 'vote-by-mail'" />
  <ElectedOfficialsIntro v-if="route.name == 'topic' && route.params.topic.toLowerCase() == 'elected-officials'" />

  <!-- ADDRESS NOT FOUND CONTENT -->
  <div
    v-if="route.name == 'not-found'"
    id="topic-panel-no-topics"
    class="section"
  >
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <div :class="MainStore.fullScreenTopicsEnabled ? 'topic-panel-half': ''">
      <h1 class="subtitle is-3">We couldn't find that address.</h1>
      <p class="subtitle is-4">Are you sure everything was spelled correctly?</p>
      <p>Here are some examples of things you can search for:</p>
      <ul class="bullet-list">
        <li>1234 Market St</li>
        <li>1001 Pine Street #201</li>
        <li>12th & Market</li>
        <li>883309050 (an OPA number with no hyphens or other characters)</li>
        <li>001S070144 (a DOR number with no hyphens of other characters)</li>
      </ul>
    </div>
  </div>

  <!-- IF AN ADDRESS IS LOADED, SHOW THE TOPICS  -->
  <div
    v-if="route.name !== 'home' && route.name !== 'not-found' && address"
    class="address-holder"
  >
    <div>
      <h1 class="address-and-marker subtitle is-3">
        <font-awesome-icon :icon="['fas', 'map-marker-alt']" /><div class="address">
          {{ address }}
        </div>
      </h1>
    </div>
    <div>PHILADELPHIA, PA {{ zipCode }}</div>

    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
  </div>

  <div
    v-if="route.name !== 'home' && route.name !== 'not-found' && route.name !== 'topic'"
    id="topic-panel-content"
    class="topics"
  >
    <topic
      :topic-name="'Elections & Ballots'"
      :topic-slug="'elections-and-ballots'"
      :topic-icon="'fa-solid fa-star'"
      :loading="!dataSourcesLoadedArray.includes('elections-and-ballots')"
      :topic-index="1"
    >
      <Ballots />
    </topic>

    <topic
      :topic-name="'Polling Place'"
      :topic-slug="'polling-place'"
      :topic-icon="'fa-solid fa-building'"
      :loading="!dataSourcesLoadedArray.includes('polling-place')"
      :topic-index="2"
    >
      <PollingPlace />
    </topic>

    <topic
      :topic-name="'Vote by Mail'"
      :topic-slug="'vote-by-mail'"
      :topic-icon="'fa-solid fa-envelope'"
      :loading="!dataSourcesLoadedArray.includes('vote-by-mail')"
      :topic-index="3"
    >
      <VoteByMail />
    </topic>

    <topic
      :topic-name="'Elected Officials'"
      :topic-slug="'elected-officials'"
      :topic-icon="'fa-solid fa-flag-usa'"
      :loading="!dataSourcesLoadedArray.includes('elected-officials')"
      :topic-index="4"
    >
      <ElectedOfficials />
    </topic>

  </div>
</template>

<style>

.address-and-marker {
  margin-top: .5rem !important;
  margin-bottom: 0px !important;
}

</style>