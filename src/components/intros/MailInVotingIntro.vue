<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n() 
import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();

import AddressSearchControl from '@/components/AddressSearchControl.vue';

</script>

<template>
  
  <div id="topic-panel-set-content">
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
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
      class="box"
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
        <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/mailInVotingtracking.aspx">{{ $t('default.introPage.link3') }}</a></li>
        <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('default.introPage.link1') }}</a></li>
        <li><a href="/ballot">{{ $t('default.introPage.link7') }}</a></li>
        <li><a href="/polling-place">{{ $t('default.introPage.link2') }}</a></li>
      </ul>
    </div>
  </div>
  
</template>