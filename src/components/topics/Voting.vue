<script setup>

import { parseISO, format } from 'date-fns';

import useTransforms from '@/composables/useTransforms';
const { nth, phoneNumber, titleCase } = useTransforms();

import { useVotingStore } from '@/stores/VotingStore';
import { computed, getCurrentInstance } from 'vue';
const VotingStore = useVotingStore();

import VerticalTable from '@/components/VerticalTable.vue';

const instance = getCurrentInstance();
import i18nFromFiles from '@/i18n/i18n.js';
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[instance.appContext.config.globalProperties.$i18n.locale];
})

const electedOfficials = computed(() => {
  if (!VotingStore.electedOfficials.rows || !VotingStore.electedOfficials.rows.length) return null;
  return VotingStore.electedOfficials.rows;
});

const council = computed(() => {
  if (electedOfficials.value) {
    return electedOfficials.value.filter((item) => {
      return item.office_label == "City Council";
    });
  } else {
    return null;
  }
});

const ballotFileId = computed(() => {
  if (electedOfficials.value) {
    return electedOfficials.value[0].ballot_file_id;
  } else {
    return null;
  }
});

const councilMember = computed(() => {
  if (council.value && council.value[0]) {
    return '<a href="http://' + council.value[0].website + '" target="_blank">' +
      council.value[0].first_name +" " +council.value[0].last_name + " - " + nth(council.value[0].district) + " Council District </a>";
  }
});

const office = computed(() => {
  if (council.value && council.value[0]) {
    return council.value[0].main_contact_address_2 + '<br>' +
      phoneNumber(council.value[0].main_contact_phone_1) + ", " + phoneNumber(council.value[0].main_contact_phone_2) + '<br>\
      F: '+ phoneNumber(council.value[0].main_contact_fax) + ' <br>\
      <b><a href=mailto:"' + council.value[0].email + '">' + council.value[0].email + '</a></b>';
  }
});

const term = computed(() => {
  if (council.value && council.value[0]) {
    return council.value[0].next_election - 4 + ' - ' + council.value[0].next_election;
  }
});

const accessibility = computed(() => {
  if (VotingStore.pollingPlaces.rows && VotingStore.pollingPlaces.rows.length) {
    const code = VotingStore.pollingPlaces.rows[0].accessibility_code;
    const answer = code== "F" ? 'buildingFullyAccessible' :
      code== "B" ? 'buildingSubstantiallyAccessible' :
      code== "M" ? 'buildingAccessibilityModified' :
      code== "A" ? 'alternateEntrance' :
      code== "R" ? 'buildingAccessibleWithRamp' :
      code== "N" ? 'buildingNotAccessible' :
      'informationNotAvailable';
    return answer;
  }
});

const parking = computed(() => {
  if (VotingStore.pollingPlaces.rows && VotingStore.pollingPlaces.rows.length) {
    const code = VotingStore.pollingPlaces.rows[0].parking_code;
    const parking = code == "N" ? 'noParking' :
      code == "G" ? 'generalParking' :
      code == "L" ? 'loadingZone' :
      'informationNotAvailable';
    return parking;
  }
});

const pollingPlaceData = computed(() => {
  if (VotingStore.pollingPlaces.rows && VotingStore.pollingPlaces.rows.length) {
    return [
      {
        label: messages.value.voting.topic.location,
        value: '<b>Ward ' + VotingStore.pollingPlaces.rows[0].ward + ', Division ' + VotingStore.pollingPlaces.rows[0].division + '</b><br>' +
            titleCase(VotingStore.pollingPlaces.rows[0].placename) + '<br>' +
            `<a target="_blank" href="https://www.google.com/maps/place/${VotingStore.pollingPlaces.rows[0].street_address}, Philadelphia, PA">${titleCase(VotingStore.pollingPlaces.rows[0].street_address)}</a>`,
      },
      {
        label: messages.value.voting.topic.hours,
        value: messages.value.voting.introPage.p4,
      },
      {
        label: messages.value.voting.topic.accessibility,
        value: `<a target="_blank" href="https://vote.phila.gov/voting/voting-at-the-polls/polling-place-accessibility/">${messages.value.voting.topic.accessibilityCodes[accessibility.value]}</a>`,
      },
      {
        label: messages.value.voting.topic.parking,
        value: messages.value.voting.topic.parkingCodes[parking.value],
      },
    ];
  }
});

const electedRepsData = computed(() => [
  {
    label: messages.value.voting.topic.districtCouncilMember,
    value: councilMember.value,
  },
  {
    label: messages.value.voting.topic.cityHallOffice,
    value: office.value,
  },
  {
    label: messages.value.voting.topic.currentTerm,
    value: term.value,
  }
]);

const electionSplit = computed(() => {
  if (VotingStore.electionSplit.rows && VotingStore.electionSplit.rows[0]) {
    return VotingStore.electionSplit.rows[0];
  }
});

const electionTypes = {
  0: 'voting.topic.badge1.specialElection',
  1: 'voting.topic.badge1.primaryElection',
  2: 'voting.topic.badge1.generalElection',
}

</script>

<template>
  <section>
    <div class="columns is-multiline column is-10 is-offset-1 has-text-centered badge">
      <div v-if="electionSplit" class="column is-12 badge-title">
        <!-- <b>Next Eligible Election: {{ electionTypes[electionSplit.election_type] }}</b> -->
        <b>{{ $t(electionTypes[electionSplit.election_type]) }}</b>
      </div>
      <div
        v-if="electionSplit && VotingStore.loadingVotingData === false"
        class="column is-12 election"
      >
        {{ format(parseISO(electionSplit.election_date), 'MMMM d, yyyy') }}
      </div>
      <div v-else class="column election">
        <p>
          <font-awesome-icon
            icon="fa-solid fa-spinner"
            spin
          />
        </p>
      </div>
    </div>
  </section>
  <div class="mt-3 mb-3 has-text-centered">
    <a
      target="_blank"
      :href="ballotFileId"
    >{{ $t('voting.topic.previewBallot') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>
  </div>

  <div
    id="Voting-description"
    class="topic-info"
    v-html="$t('voting.topic.callout1.text')"
  >
  </div>

  <h2 class="subtitle is-5 vert-table-title">
    {{ $t('voting.topic.pollingPlace') }}
  </h2>
  <vertical-table
    v-if="!VotingStore.loadingVotingData"
    :table-id="'pollingPlaceTable'"
    :data="pollingPlaceData"
  />
  <div v-else>
    <p>
      Loading polling place data... <font-awesome-icon
        icon="fa-solid fa-spinner"
        spin
      />
    </p>
  </div>
  <a
    class="table-link"
    target="_blank"
    :href="`https://vote.phila.gov/voting/vote-by-mail/`"
  >{{ $t('voting.topic.verticalTable1.link') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>
  <br>
  <br>

  <h2 class="subtitle is-5 vert-table-title">
    {{ $t('voting.topic.electedRep') }}
  </h2>
  <vertical-table
    v-if="!VotingStore.loadingVotingData"
    :table-id="'electedRepsTable'"
    :data="electedRepsData"
  />
  <div v-else>
    <p>
      Loading elected representatives data... <font-awesome-icon
        icon="fa-solid fa-spinner"
        spin
      />
    </p>
  </div>
  <a
    class="table-link"
    target="_blank"
    :href="`https://vote.phila.gov/voting/current-elected-officials/`"
  >{{ $t('voting.topic.verticalTable2.link') }} <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a>
  <br>
  <br>
</template>

<style scoped>

.badge-title {
  padding-top: 0.25rem !important;
  line-height: 1.2rem;
  padding-bottom: 4px;
  height: auto;
  color: white;
  border-width: 1px;
  border-style: solid;
  border-color: white;
  background-color: rgb(68, 68, 68);
}

.election {
  font-size: 2rem;
  line-height: 2.3rem;
  background-color: #f0f0f0;
  border-width: 1px;
  border-style: solid;
  border-color: white;
}

</style>