<script setup>
import { formatInTimeZone } from 'date-fns-tz';

import { useBallotsStore } from '@/stores/BallotsStore';
import { computed } from 'vue';
const BallotsStore = useBallotsStore();

let fieldNames = {
  'election_date': 'election_date',
};

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

const electionSplit = computed(() => {
  if (BallotsStore.electionSplit.rows && BallotsStore.electionSplit.rows[0]) {
    return BallotsStore.electionSplit.rows[0];
  }
});

const electionDate = computed(() => {
  if (electionSplit.value) {
    return formatInTimeZone(electionSplit.value[fieldNames.election_date], 'America/New_York', 'MMMM d, yyyy');
  }
});

const electionTypes = {
  0: 'ballot.topic.badge1.specialElection',
  1: 'ballot.topic.badge1.primaryElection',
  2: 'ballot.topic.badge1.generalElection',
}

const loadingData = computed(() => BallotsStore.loadingBallotsData );

const compareFn = (a, b, field) => {
  if (a[field] < b[field]) {
    return -1;
  } else if (a[field] > b[field]) {
    return 1;
  }
  return 0;
}

const importantDates = computed(() => {
  let data;
  if (BallotsStore.importantDates.length) {
    data = [ ...BallotsStore.importantDates ]
    data.sort((a, b) => compareFn(a, b, 'date'))
  }
  return data;
})

const importantDatesTableData = computed(() => {
  return {
    columns: [
      {
        label: 'Event title',
        field: 'event_title',
      },
      {
        label: 'Date',
        field: 'event_date',
      },
    ],
    rows: importantDates.value || [],
  }
}) 

</script>

<template>
  <section>
    <div class="columns is-multiline column is-8 is-offset-2 has-text-centered badge">
      <div v-if="electionSplit" class="column is-12 badge-title">
        <b>{{ $t(electionTypes[electionSplit.election_type]) }}</b>
      </div>
      <div
        v-if="electionSplit"
        class="column is-12 election"
      >
        {{ electionDate }}
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
    v-if="loadingData === false"
    class="horizontal-table"
  >
    <vue-good-table
      id="important-dates"
      :columns="importantDatesTableData.columns"
      :rows="importantDatesTableData.rows"
      style-class="table nearby-table"
    >
      <!-- <template #emptystate>
        <div v-if="loadingData">
          Loading important dates... <font-awesome-icon
            icon="fa-solid fa-spinner"
            spin
          />
        </div>
        <div v-else-if="MailinVotingStore.dataError">
          Data loading error - try refreshing the page
        </div>
        <div v-else>
          No important dates found
        </div>
      </template> -->
    </vue-good-table>
  </div>
  
  <!-- <div
    id="dates-description"
    class="topic-info"
  >
    {{ $t('ballot.topic.paragraph1.text') }}
    <a target='_blank' href='https://vote.phila.gov/voting/important-dates-for-voters/'>
      {{ $t('shared.link11') }}.
    </a>
  </div> -->

  <a target="_blank" :href="'https://vote.phila.gov/voting/vote-by-mail/'">
    {{ $t('shared.link1') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" />
  </a>
  <br>
  <!-- <a target="_blank" :href="'https://vote.phila.gov/voting/important dates for voters/'">
    {{ $t('shared.link6') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" />
  </a>
  <br>
  <a target='_blank' href='https://vote.phila.gov/voting/important-dates-for-voters/'>
    {{ $t('shared.link11') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" />
  </a> -->


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