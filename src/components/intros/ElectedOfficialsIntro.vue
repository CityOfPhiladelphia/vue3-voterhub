<script setup>

import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();

import AddressSearchControl from '@/components/AddressSearchControl.vue';

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
        {{ $t('electedOfficials.introPage.introTitle') }}
      </h1>
      <p class="subtitle is-4">
        {{ $t('electedOfficials.introPage.p1') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('electedOfficials.introPage.ul1.li1') }}</li>
        <li>{{ $t('electedOfficials.introPage.ul1.li2') }}</li>
        <li>{{ $t('electedOfficials.introPage.ul1.li3') }}</li>
      </ul>
      <br>

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('shared.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://vote.phila.gov/voting/current-elected-officials/">{{ $t('shared.link9') }}</a></li>
          <li><a href="/polling-place">{{ $t('shared.link2') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('shared.link1') }}</a></li>
          <li><a href="/elections-and-ballots">{{ $t('shared.link7') }}</a></li>
          <li><a target="_blank" href="https://vote.phila.gov/candidates-campaigns/campaign-finance/">{{ $t('shared.link10') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
  
</template>