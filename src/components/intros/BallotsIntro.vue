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
        {{ $t('shared.p2') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('ballot.introPage.ul1.li1') }}</li>
        <li>{{ $t('ballot.introPage.ul1.li2') }}</li>
      </ul>
      <br>

      <p><b>{{ $t('shared.hours') }}: </b>{{ $t('shared.p4') }}</p>
      <br>

      <div 
        class="topic-info"
        v-html="$t('shared.p5')"
      />

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('shared.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('shared.link1') }}</a></li>
          <li><a href="/polling-place">{{ $t('shared.link2') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ $t('shared.link3') }}</a></li>
          <li><a href="/vote-by-mail">{{ $t('shared.link4') }}</a></li>
          <li><a href="/elected-officials">{{ $t('shared.link5') }}</a></li>
          <li><a target="_blank" href="https://vote.phila.gov/voting/important-dates-for-voters/">{{ $t('shared.link6') }}</a></li>
        </ul>
      </div>
    </div>    
  </div>

</template>