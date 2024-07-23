<script setup>
import { computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { point, featureCollection } from '@turf/helpers';

import { useMailinVotingStore } from '@/stores/MailinVotingStore';
const MailinVotingStore = useMailinVotingStore();
import { useMainStore } from '@/stores/MainStore';
const MainStore = useMainStore();
import { useMapStore } from '@/stores/MapStore';
const MapStore = useMapStore();

const instance = getCurrentInstance();
import i18nFromFiles from '@/i18n/i18n.js';
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[instance.appContext.config.globalProperties.$i18n.locale];
})

import useScrolling from '@/composables/useScrolling';
const { handleRowClick, handleRowMouseover, handleRowMouseleave, isElementInViewport } = useScrolling();

const loadingData = computed(() => MailinVotingStore.loadingData );

const compareFn = (a, b, field) => {
  if (a[field] < b[field]) {
    return -1;
  } else if (a[field] > b[field]) {
    return 1;
  }
  return 0;
}

const mailinVoting = computed(() => {
  let data;
  if (MailinVotingStore.mailinVoting.rows) {
    data = [ ...MailinVotingStore.mailinVoting.rows ]
    data.sort((a, b) => compareFn(a, b, 'distance'))
  }
  return data;
})

const mailinVotingGeojson = computed(() => {
  if (!mailinVoting.value) return [point([0,0])];
  return mailinVoting.value.map(item => point([item.lon, item.lat], { id: item.cartodb_id, type: 'mailinVoting' }));
})
watch (() => mailinVotingGeojson.value, async(newGeojson) => {
  const map = MapStore.map;
  if (map.getSource) map.getSource('nearby').setData(featureCollection(newGeojson));
});

const hoveredStateId = computed(() => { return MainStore.hoveredStateId; });

onMounted(() => {
  const map = MapStore.map;
  if (!MailinVotingStore.loadingData && mailinVotingGeojson.value.length > 0) { map.getSource('nearby').setData(featureCollection(mailinVotingGeojson.value)) }
});
onBeforeUnmount(() => {
  const map = MapStore.map;
  if (map.getSource('nearby')) { map.getSource('nearby').setData(featureCollection([point([0,0])])) }
});

const mailinVotingTableData = computed(() => {
  return {
    columns: [
      {
        label: 'Location',
        field: 'site_name',
      },
      {
        label: 'Type and Hours',
        field: 'site_type',
      },
      {
        label: 'Distance',
        field: 'distance_miles',
      }
    ],
    rows: mailinVoting.value || [],
  }
});

const clickedMarkerId = computed(() => { return MainStore.clickedMarkerId; });

watch(() => clickedMarkerId.value, (newClickedMarkerId) => {
  if (newClickedMarkerId) {
    const el = document.getElementsByClassName(newClickedMarkerId)[0];
    const visible = isElementInViewport(el);
    if (!visible && !MainStore.isMobileDevice) {
      el.scrollIntoView({ block: 'center' });
    }
  }
});

</script>

<template>
  <section>
    <div
      id="Mail-in-callout"
      class="topic-info"
    >
      {{ $t('mailInVoting.topic.exclamationCallout1.p1') }}
    </div>

    <h2 class="subtitle is-5 mb-2">
      {{ $t('mailInVoting.topic.table1.title') }}
    </h2>

    <div
      id="Mail-in-dates"
      class="topic-info"
      v-html="$t('mailInVoting.topic.paragraph1.text')"
    >
    </div>

    <h2 class="subtitle is-5 mb-2">
      {{ $t('mailInVoting.topic.h3_1') }}
    </h2>

    <div
      id="Mail-in-locations"
      class="topic-info"
    >
      {{ $t('mailInVoting.topic.paragraph2.text') }}
    </div>

    <ul class="bullet-list mb-4">
      <li>{{ $t('mailInVoting.topic.ul1.li1') }}</li>
      <li>{{ $t('mailInVoting.topic.ul1.li2') }}</li>
      <li>{{ $t('mailInVoting.topic.ul1.li3') }}</li>
    </ul>

    <div
      id="Mail-in-locations"
      class="topic-info"
      v-html="$t('mailInVoting.topic.paragraph3.text')"
    >
    </div>

    <h2 class="subtitle is-5 mb-2">
      {{ $t('mailInVoting.topic.h4_1') }}
      <font-awesome-icon
        v-if="loadingData"
        icon="fa-solid fa-spinner"
        spin
      />
      <span v-else>({{ mailinVotingTableData.rows.length }})</span>
    </h2>
    <div class="horizontal-table">
      <vue-good-table
        id="mailinVoting"
        :columns="mailinVotingTableData.columns"
        :rows="mailinVotingTableData.rows"
        :row-style-class="row => hoveredStateId === row.cartodb_id ? 'active-hover ' + row.cartodb_id : 'inactive ' + row.cartodb_id"
        style-class="table nearby-table"
        @row-mouseenter="handleRowMouseover($event, 'cartodb_id')"
        @row-mouseleave="handleRowMouseleave"
        @row-click="handleRowClick($event, 'cartodb_id', 'mailinVoting')"
      >
        <template #emptystate>
          <div v-if="loadingData">
            Loading Mail-in Voting Sites... <font-awesome-icon
              icon="fa-solid fa-spinner"
              spin
            />
          </div>
          <div v-else-if="MailinVotingStore.dataError">
            Data loading error - try refreshing the page
          </div>
          <div v-else>
            No Mail-in Voting sites found
          </div>
        </template>
      </vue-good-table>
    </div>
  </section>

</template>