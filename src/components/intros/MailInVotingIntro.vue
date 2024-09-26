<script setup>

import { useMainStore } from '@/stores/MainStore.js'
const MainStore = useMainStore();

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
        {{ $t('shared.p2') }}
      </p>
      <ul class="bullet-list">
        <li>{{ $t('mailInVoting.introPage.ul1.li1') }}</li>
      </ul>
      <br>

      <p><b>{{ $t('shared.note') }}: </b>{{ $t('mailInVoting.introPage.p4') }}</p>
      <br>

      <p
        class="topic-info"
        v-html="$t('mailInVoting.introPage.p5')"
      ></p>

      <div
        class="section-header"
        :style="{ 'background-color': '#F0F0F0', 'color': 'black' }"
      >
        <b>{{ $t('shared.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="bullet-list">
          <li><a target="_blank" href="https://vote.phila.gov/voting/vote-by-mail/vote-by-mail/">{{ $t('shared.link8') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ $t('shared.link3') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ $t('shared.link1') }}</a></li>
          <li><a href="/elections-and-ballots">{{ $t('shared.link7') }}</a></li>
          <li><a href="/polling-place">{{ $t('shared.link2') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>