<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n() 
import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();
</script>

<template>

  <div id="topic-panel-set-content">
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <h1 class="subtitle is-3">
      {{ $t('electedOfficials.introPage.introTitle') }}
    </h1>
    <p class="subtitle is-4">
      {{ $t('electedOfficials.introPage.p3') }}
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
      <b>{{ $t('pollingPlace.introPage.relatedContent') }}</b>
    </div>
    <div class="custom-section">
      <ul class="bullet-list">
        <li><a target="_blank" href="https://vote.phila.gov/voting/current-elected-officials/">{{ $t('default.introPage.link9') }}</a></li>
        <li><a href="/polling-place">{{ $t('default.introPage.link2') }}</a></li>
        <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('default.introPage.link1') }}</a></li>
        <li><a href="/ballot">{{ $t('default.introPage.link7') }}</a></li>
        <li><a target="_blank" href="https://vote.phila.gov/candidates-campaigns/campaign-finance/">{{ $t('default.introPage.link10') }}</a></li>
      </ul>
    </div>
  </div>
  
</template>