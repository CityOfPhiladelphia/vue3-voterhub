<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n() 
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
        {{ $t('ballot.introPage.introTitle') }}
      </h1>
      <p class="subtitle is-4">
        {{ $t('ballot.introPage.p3') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('ballot.introPage.ul1.li1') }}</li>
        <li>{{ $t('ballot.introPage.ul1.li2') }}</li>
        <li>{{ $t('ballot.introPage.ul1.li3') }}</li>
      </ul>
      <br>

      <p><b>{{ $t('default.introPage.p4_b') }}</b>{{ $t('default.introPage.p4') }}</p>
      <br>

      <div 
        class="topic-info"
        v-html="$t('default.introPage.p5')"
      />

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('default.introPage.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('default.introPage.link1') }}</a></li>
          <li><a href="/polling-place">{{ $t('default.introPage.link2') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ $t('default.introPage.link3') }}</a></li>
          <li><a href="/mail-in-voting">{{ $t('default.introPage.link4') }}</a></li>
          <li><a href="/elected-officials">{{ $t('default.introPage.link5') }}</a></li>
          <li><a target="_blank" href="https://vote.phila.gov/voting/important-dates-for-voters/">{{ $t('default.introPage.link6') }}</a></li>
        </ul>
      </div>
    </div>    
  </div>

</template>