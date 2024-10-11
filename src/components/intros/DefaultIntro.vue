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
        {{ $t('default.introPage.introTitle') }}
      </h1>
      <p class="subtitle is-4">
        {{ $t('shared.p1') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('shared.link12') }}</li>
        <li>{{ $t('shared.link7') }}</li>
        <li>{{ $t('shared.link13') }}</li>
        <li>{{ $t('shared.link14') }}</li>
      </ul>
      <br>

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('shared.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="custom-ul">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ t('shared.link1') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ t('shared.link3') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>