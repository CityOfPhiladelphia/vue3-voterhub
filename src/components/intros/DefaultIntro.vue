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
        {{ $t('default.introPage.p3') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('default.introPage.ul1.li1') }}</li>
        <li>{{ $t('default.introPage.ul1.li2') }}</li>
        <li>{{ $t('default.introPage.ul1.li3') }}</li>
        <li>{{ $t('default.introPage.ul1.li4') }}</li>
        <li>{{ $t('default.introPage.ul1.li5') }}</li>
      </ul>
      <br>

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('default.introPage.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="custom-ul">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ t('default.introPage.link1') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ t('default.introPage.link3') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>