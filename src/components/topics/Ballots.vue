<script setup>

import { parseISO, format } from 'date-fns';

import { useBallotsStore } from '@/stores/BallotsStore';
import { computed } from 'vue';
const BallotsStore = useBallotsStore();

const electedOfficials = computed(() => {
  if (!BallotsStore.electedOfficials.rows || !BallotsStore.electedOfficials.rows.length) return null;
  return BallotsStore.electedOfficials.rows;
});

const ballotFileId = computed(() => {
  if (electedOfficials.value) {
    return electedOfficials.value[0].ballot_file_id;
  } else {
    return null;
  }
});

const nextElectionDate = computed(() => {
  if (BallotsStore.nextElection.election_count_down_settings) {
    return format(parseISO(BallotsStore.nextElection.election_count_down_settings.election_day), 'MMMM d, yyyy');
  }
});

</script>

<template>
  <section>
    <div class="columns is-multiline column is-8 is-offset-2 has-text-centered badge">
      <div class="column is-12 badge-title">
        <b>{{ $t('ballot.topic.badge1.header') }}</b>
      </div>
      <div
        v-if="nextElectionDate"
        class="column is-12 election"
      >
        {{ nextElectionDate }}
      </div>
      <div
        v-else
        class="column"
      >
        <font-awesome-icon
          icon="fa-solid fa-spinner fa-2x"
          spin
        />
      </div>
    </div>
  </section>
  <div class="mt-3 mb-3 has-text-centered">
    <a
      target="_blank"
      :href="ballotFileId"
    >{{ $t('ballot.topic.previewBallot') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>
  </div>

  <div
    id="Voting-description"
    class="topic-info"
    v-html="$t('ballot.topic.callout1.text')"
  >
  </div>
  <div
    id="dates-description"
    class="topic-info"
    v-html="$t('ballot.topic.paragraph1.text')"
  >
  </div>

  <!-- class="table-link" -->
  <a
    target="_blank"
    :href="'https://vote.phila.gov/voting/vote-by-mail/'"
  >{{ $t('ballot.topic.links.link1') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>


</template>

<style scoped>

.badge-title {
  padding-top: 0.25rem !important;
  height: 2rem;
  color: white;
  border-width: 1px;
  border-style: solid;
  border-color: white;
  background-color: rgb(68, 68, 68);
}

.election {
  font-size: 2rem;
  background-color: #f0f0f0;
  border-width: 1px;
  border-style: solid;
  border-color: white;
}

</style>