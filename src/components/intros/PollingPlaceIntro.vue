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
        {{ $t('pollingPlace.introPage.introTitle') }}
      </h1>
      <p class="subtitle is-4">
        {{ $t('pollingPlace.introPage.p3') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('pollingPlace.introPage.ul1.li1') }}</li>
        <li>{{ $t('pollingPlace.introPage.ul1.li2') }}</li>
      </ul>
      <br>

      <p><b>{{ $t('default.introPage.p4_b') }}</b>{{ $t('default.introPage.p4') }}</p>
      <br>

      <p
        class="topic-info"
        v-html="$t('default.introPage.p5')"
      />

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('pollingPlace.introPage.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('default.introPage.link1') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ $t('default.introPage.link3') }}</a></li>
          <li><a href="/mail-in-voting">{{ $t('default.introPage.link4') }}</a></li>
          <li><a href="/ballot">{{ $t('default.introPage.link7') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
  
</template>