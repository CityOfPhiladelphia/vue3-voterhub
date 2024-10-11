<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { point, featureCollection } from '@turf/helpers';

import { useVoteByMailStore } from '@/stores/VoteByMailStore';
const VoteByMailStore = useVoteByMailStore();
import { useMainStore } from '@/stores/MainStore';
const MainStore = useMainStore();
import { useMapStore } from '@/stores/MapStore';
const MapStore = useMapStore();

import TextFilter from '@/components/TextFilter.vue';
const textSearch = ref('');

const instance = getCurrentInstance();
import i18nFromFiles from '@/i18n/i18n.js';
const locale = computed(() => {
  return instance.appContext.config.globalProperties.$i18n.locale;
})
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[locale.value];
})

import useScrolling from '@/composables/useScrolling';
const { handleRowClick, handleRowMouseover, handleRowMouseleave, isElementInViewport } = useScrolling();

const loadingData = computed(() => VoteByMailStore.loadingData );

const compareFn = (a, b, field) => {
  if (a[field] < b[field]) {
    return -1;
  } else if (a[field] > b[field]) {
    return 1;
  }
  return 0;
}

const voteByMail = computed(() => {
  let data;
  if (VoteByMailStore.voteByMail.rows) {
    data = [ ...VoteByMailStore.voteByMail.rows ]
      .filter(item => {
      // console.log('item:', item, 'item.name_and_address:', item.name_and_address);
      let value = item.location.toLowerCase().includes(textSearch.value.toLowerCase()) ||
      item.address.toLowerCase().includes(textSearch.value.toLowerCase()) ||
      item.type.toLowerCase().includes(textSearch.value.toLowerCase());
      console.log('value:', value);
      return value;
    });
    data.sort((a, b) => compareFn(a, b, 'distance'))
  }
  return data;
})

const voteByMailGeojson = computed(() => {
  if (!voteByMail.value) return [point([0,0])];
  return voteByMail.value.map(item => point([item.lng, item.lat], { id: item.cartodb_id, type: 'voteByMail' }));
})
watch (() => voteByMailGeojson.value, async(newGeojson) => {
  const map = MapStore.map;
  if (map.getSource) map.getSource('nearby').setData(featureCollection(newGeojson));
});

const hoveredStateId = computed(() => { return MainStore.hoveredStateId; });

onMounted(() => {
  const map = MapStore.map;
  if (!VoteByMailStore.loadingData && voteByMailGeojson.value.length > 0) { map.getSource('nearby').setData(featureCollection(voteByMailGeojson.value)) }
});
onBeforeUnmount(() => {
  const map = MapStore.map;
  if (map.getSource('nearby')) { map.getSource('nearby').setData(featureCollection([point([0,0])])) }
});

const voteByMailTableData = computed(() => {
  return {
    columns: [
      {
        label: messages.value.shared.location,
        field: 'name_and_address',
        html: true,
      },
      {
        label: messages.value.voteByMail.topic.horizontalTable2.typeAndHours,
        field: 'type',
      },
      {
        label: messages.value.voteByMail.topic.horizontalTable2.distance,
        field: 'distance_miles',
      }
    ],
    rows: voteByMail.value || [],
  }
});

const typeFieldFn = (row) => {
  return row.type_and_hours;
}

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

const importantDates = computed(() => {
  let data;
  if (VoteByMailStore.importantDates.length) {
    data = [ ...VoteByMailStore.importantDates ]
    data.sort((a, b) => compareFn(a, b, 'date'))
  }
  return data;
})

const eventField = () => {
  if (locale.value === 'zh') return 'title_chinese';
  if (locale.value === 'es') return 'title_spanish';
  if (locale.value === 'en-us') return 'event_title';
}

const dateField = () => {
  if (locale.value === 'zh') return 'date_chinese';
  if (locale.value === 'es') return 'date_spanish';
  if (locale.value === 'en-us') return 'date_english';
}

const importantDatesTableData = computed(() => {
  return {
    columns: [
      {
        label: messages.value.voteByMail.topic.horizontalTable1.column2,
        field: dateField(),
      },
      {
        label: messages.value.voteByMail.topic.horizontalTable1.column1,
        field: eventField(),
      },
    ],
    rows: importantDates.value || [],
  }
}) 

</script>

<template>
  <section>
    <div
      id="Mail-in-callout"
      class="topic-info"
    >
      {{ $t('voteByMail.topic.exclamationCallout1.p1') }}
    </div>

    <h2 class="subtitle is-5 mb-2">
      {{ $t('voteByMail.topic.horizontalTable1.title') }}
      <font-awesome-icon
        v-if="loadingData"
        icon="fa-solid fa-spinner"
        spin
      />
      <span v-else>({{ importantDatesTableData.rows.length }})</span>
    </h2>
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
        <template #emptystate>
          <div v-if="loadingData">
            {{ $t('voteByMail.topic.horizontalTable1.loadingImportantDates')}} <font-awesome-icon
              icon="fa-solid fa-spinner"
              spin
            />
          </div>
          <div v-else-if="VoteByMailStore.datesDataError">
            {{ $t('shared.dataLoadingError') }}
          </div>
          <div v-else>
            {{ $t('voteByMail.topic.horizontalTable1.noImportantDates') }}
          </div>
        </template>
      </vue-good-table>
    </div>

    <h2 class="subtitle is-5 mt-5 mb-2">
      {{ $t('voteByMail.topic.mailinBallots') }}
    </h2>

    <div
      id="Mail-in-locations"
      class="topic-info"
    >
      {{ $t('voteByMail.topic.paragraph2.text') }}
    </div>

    <ul class="bullet-list mb-4">
      <li v-html="$t('voteByMail.topic.ul1.li1')"></li>
      <li>{{ $t('voteByMail.topic.ul1.li2') }}</li>
      <li>{{ $t('voteByMail.topic.ul1.li3') }}</li>
    </ul>

    <div
      id="Mail-in-locations"
      class="topic-info"
      v-html="$t('voteByMail.topic.paragraph3.text')"
    >
    </div>

    <div class="column is-8 is-12-mobile">
      <TextFilter
        v-model="textSearch"
        :search-label="`Search Locations`"
        :placeholder="`Search Locations`"
      />
    </div>

    <h2 class="subtitle is-5 mb-2 mt-4">
      {{ $t('voteByMail.topic.horizontalTable2.title') }}
      <font-awesome-icon
        v-if="loadingData"
        icon="fa-solid fa-spinner"
        spin
      />
      <span v-else>({{ voteByMailTableData.rows.length }})</span>
    </h2>
    <div class="horizontal-table">
      <vue-good-table
        id="vote-by-mail"
        :columns="voteByMailTableData.columns"
        :rows="voteByMailTableData.rows"
        :row-style-class="row => hoveredStateId === row.cartodb_id ? 'active-hover ' + row.cartodb_id : 'inactive ' + row.cartodb_id"
        style-class="table nearby-table"
        @row-mouseenter="handleRowMouseover($event, 'cartodb_id')"
        @row-mouseleave="handleRowMouseleave"
        @row-click="handleRowClick($event, 'cartodb_id', 'voteByMail')"
      >
        <template #table-row="props">
          <span v-if="props.column.field == 'type'">
            <span v-if="props.row.type == 'Dropbox'">{{ $t('voteByMail.topic.horizontalTable2.dropbox') }} {{ props.row.date_close }}</span>
            <span v-if="props.row.type == 'Election Office'">{{$t('voteByMail.topic.horizontalTable2.electionOffice')}}</span>
            <span v-if="props.row.type == 'Satellite Election Office'">{{$t('voteByMail.topic.horizontalTable2.satelliteElectionOffice')}}</span>
          </span>
        </template>
        <template #emptystate>
          <div v-if="loadingData">
            Loading Vote by Mail Sites... <font-awesome-icon
              icon="fa-solid fa-spinner"
              spin
            />
          </div>
          <div v-else-if="VoteByMailStore.locationsDataError">
            Data loading error
          </div>
          <div v-else>
            No Vote by Mail sites found
          </div>
        </template>
      </vue-good-table>
    </div>
  </section>

</template>

<style>

@media 
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px)  {

	/* Label the data */
    
	#vote-by-mail {

    td:nth-of-type(2) {
      min-height: 60px;
    }

    td:nth-of-type(1):before { content: "Location"; }
    td:nth-of-type(2):before { content: "Type and Hours"; }
    td:nth-of-type(3):before { content: "Distance"; }
  }
}

</style>