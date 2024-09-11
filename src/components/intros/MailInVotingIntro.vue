<script setup>

// import { computed, watch } from 'vue'
// import { point, featureCollection } from '@turf/helpers';

import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();
// import { useMapStore } from '@/stores/MapStore.js'
// const MapStore = useMapStore();
// import { useMailinVotingStore } from '@/stores/MailinVotingStore.js'
// const MailinVotingStore = useMailinVotingStore();

import AddressSearchControl from '@/components/AddressSearchControl.vue';

// const mailinVoting = computed(() => {
//   let data;
//   if (MailinVotingStore.mailinVoting.rows) {
//     data = [ ...MailinVotingStore.mailinVoting.rows ]
//   }
//   return data;
// })

// const mailinVotingGeojson = computed(() => {
//   if (!mailinVoting.value) return [point([0,0])];
//   return mailinVoting.value.map(item => point([item.lon, item.lat], { id: item.cartodb_id, type: 'mailinVoting' }));
// })

// watch(
//   () => MailinVotingStore.mailinVoting,
//     async newGeojson => {
//     if (import.meta.env.VITE_DEBUG == 'true') console.log('MailinVotingIntro watch mailinVotingGeojson, newGeojson:', newGeojson, 'MapStore.map:', MapStore.map);
//     const map = MapStore.map;
//     if (!MailinVotingStore.loadingData && mailinVotingGeojson.value.length > 0 && map.getSource) { map.getSource('nearby').setData(featureCollection(mailinVotingGeojson.value)) }
//   }
// )

// watch(
//   () => MapStore.map,
//     async newMap => {
//     if (import.meta.env.VITE_DEBUG == 'true') console.log('MailinVotingIntro watch mailinVotingGeojson, newMap:', newMap, 'MapStore.map:', MapStore.map);
//     if (!MailinVotingStore.loadingData && mailinVotingGeojson.value.length > 0 && newMap.getSource) { newMap.getSource('nearby').setData(featureCollection(mailinVotingGeojson.value)) }
//   }
// )

</script>

<template>
  
  <div
    id="topic-panel-no-topics"
    class="section"
  >
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <div :class="MainStore.fullScreenTopicsEnabled ? 'topic-panel-half': ''">
      <h1 class="subtitle is-3">
        {{ $t('mailInVoting.introPage.introTitle') }}
      </h1>
      <p class="subtitle is-4">
        {{ $t('mailInVoting.introPage.p3') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('mailInVoting.introPage.ul1.li1') }}</li>
      </ul>
      <br>

      <p><b>{{ $t('mailInVoting.introPage.p4_b') }}</b>{{ $t('mailInVoting.introPage.p4') }}</p>
      <br>

      <p
        class="topic-info"
        v-html="$t('mailInVoting.introPage.p5')"
      />

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('default.introPage.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://vote.phila.gov/voting/vote-by-mail/vote-by-mail/">{{ $t('default.introPage.link8') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ $t('default.introPage.link3') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('default.introPage.link1') }}</a></li>
          <li><a href="/elections-and-ballots">{{ $t('default.introPage.link7') }}</a></li>
          <li><a href="/polling-place">{{ $t('default.introPage.link2') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>