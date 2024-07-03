<script setup>

import { useI18n } from 'vue-i18n'
const { t } = useI18n() 

import { computed } from 'vue';
import { useMainStore } from '@/stores/MainStore.js'
const GeocodeStore = useGeocodeStore();
import { useGeocodeStore } from '@/stores/GeocodeStore.js'
const MainStore = useMainStore();
import { useCondosStore } from '@/stores/CondosStore.js'
const CondosStore = useCondosStore();

import FullScreenTopicsToggleTab from '@/components/FullScreenTopicsToggleTab.vue';
import AddressSearchControl from '@/components/AddressSearchControl.vue';

import Topic from '@/components/Topic.vue';
// import Property from '@/components/topics/Property.vue';
// import Condos from '@/components/topics/Condos.vue';
// import Deeds from '@/components/topics/Deeds.vue';
// import LI from '@/components/topics/LI.vue';
// import Zoning from '@/components/topics/Zoning.vue';
import PollingPlace from '@/components/topics/PollingPlace.vue';
// import NearbyActivity from '@/components/topics/nearbyActivity/NearbyActivity.vue';
// import ThreeOneOne from '@/components/topics/cityAtlas/ThreeOneOne.vue';
// import Stormwater from '@/components/topics/cityAtlas/Stormwater.vue';
// import Districts from '@/components/topics/cityAtlas/Districts.vue';

import { useRoute } from 'vue-router';

const version = import.meta.env.VITE_VERSION;

const route = useRoute();

const address = computed(() => MainStore.currentAddress);
const dataSourcesLoadedArray = computed(() => MainStore.dataSourcesLoadedArray);

const zipCode = computed(() => {
  if (GeocodeStore.aisData && GeocodeStore.aisData.features) {
    return GeocodeStore.aisData.features[0].properties.zip_code + '-' + GeocodeStore.aisData.features[0].properties.zip_4;
  }
  return '';
});

</script>

<template>
  <full-screen-topics-toggle-tab
    v-show="!MainStore.fullScreenMapEnabled"
  />
  <!-- v-once -->
      
  <!-- FRONT PAGE CONTENT -->
  <div
    v-if="route.name == 'home' && version == 'atlas'"
    id="topic-panel-set-content"
  >
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <div class="topic-panel-final-content">
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
        <b>{{ t('default.introPage.relatedContent') }}</b>
      </div>
      <div class="custom-section">
        <ul class="custom-ul">
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx">{{ t('default.introPage.link1') }}</a></li>
          <li><a target="_blank" href="https://www.pavoterservices.pa.gov/pages/ballottracking.aspx">{{ t('default.introPage.link3') }}</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div
    v-if="route.name == 'home' && version == 'cityatlas'"
    id="topic-panel-set-content"
  >
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <div class="topic-panel-final-content">
      <h1 class="subtitle is-3">
        CityAtlas connects you with information about any address in the city.
      </h1>
      <p class="subtitle is-4">
        Here are some things you can do with CityAtlas:
      </p>
      <ul class="bullet-list">
        <li>Research real estate information including property values, zoning, and document archives</li>
        <li>Get the history of permits, licenses, and inspections at any address</li>
        <li>Easily access high-resolution street-level and aerial imagery</li>
        <li>View activity around an address, including vacancy, crime, 311 service requests, and more</li>
        <li>Explore historical imagery and maps</li>
      </ul>
      <br>
      <p>To get started, click anywhere on the map, or type an address, intersection, property assessment account number, or Department of Records Map Registry number into the search box.</p>
    </div>
  </div>

  <!-- ADDRESS NOT FOUND CONTENT -->
  <div
    v-if="route.name == 'not-found'"
    id="topic-panel-set-content"
  >
    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
    <div class="topic-panel-final-content">
      <h1 class="subtitle is-3">We couldn't find that address.</h1>
      <p class="subtitle is-4">Are you sure everything was spelled correctly?</p>
      <p>Here are some examples of things you can search for:</p>
      <ul class="bullet-list">
        <li>1234 Market St</li>
        <li>1001 Pine Street #201</li>
        <li>12th & Market</li>
        <li>883309050 (an OPA number with no hyphens or other characters)</li>
        <li>001S070144 (a DOR number with no hyphens of other characters)</li>
      </ul>
    </div>
  </div>

  <!-- IF AN ADDRESS IS LOADED, SHOW THE TOPICS  -->
  <div
    v-if="route.name !== 'home' && route.name !== 'not-found' && address"
    class="address-holder"
  >
    <div>
      <h1 class="address-and-marker subtitle is-3">
        <font-awesome-icon :icon="['fas', 'map-marker-alt']" /><div class="address">
          {{ address }}
        </div>
      </h1>
    </div>
    <div>PHILADELPHIA, PA {{ zipCode }}</div>

    <div v-if="MainStore.fullScreenTopicsEnabled">
      <address-search-control :input-id="'address-bar-search-input'" />
    </div>
  </div>

  <div
    v-if="route.name !== 'home' && route.name !== 'not-found'"
    id="topic-panel-content"
    class="topics"
  >
    <!-- <topic
      :topic-name="'Property'"
      :topic-icon="'fa-solid fa-home'"
      :loading="!dataSourcesLoadedArray.includes('Property')"
      :topic-index="1"
    >
      <Property />
    </topic> -->

    <!-- <topic
      v-show="CondosStore.condosData.pages.page_1.features && CondosStore.condosData.pages.page_1.features.length"
      :topic-name="'Condominiums'"
      :topic-icon="'fa-solid fa-building'"
      :loading="!dataSourcesLoadedArray.includes('Condominiums')"
      :topic-index="2"
    >
      <Condos v-if="dataSourcesLoadedArray.includes('Condominiums')" />
    </topic> -->

    <!-- <topic
      :topic-name="'Deeds'"
      :topic-icon="'fa-solid fa-book'"
      :loading="!dataSourcesLoadedArray.includes('Deeds')"
      :topic-index="2"
    >
      <Deeds />
    </topic> -->

    <!-- <topic
      :topic-name="'Licenses & Inspections'"
      :topic-icon="'fa-solid fa-wrench'"
      :loading="!dataSourcesLoadedArray.includes('Licenses & Inspections')"
      :topic-index="3"
    >
      <LI />
    </topic> -->

    <!-- <topic
      :topic-name="'Zoning'"
      :topic-icon="'fa-solid fa-university'"
      :loading="!dataSourcesLoadedArray.includes('Zoning')"
      :topic-index="4"
    >
      <Zoning />
    </topic> -->

    <topic
      :topic-name="$t('pollingPlace.topic.pollingPlace')"
      :topic-icon="'fa-solid fa-building'"
      :loading="!dataSourcesLoadedArray.includes('Polling Place')"
      :topic-index="5"
    >
      <PollingPlace />
    </topic>

    <!-- <topic
      v-if="MainStore.appVersion == 'cityatlas'"
      :topic-name="'311'"
      :topic-icon="'fa-solid fa-phone'"
      :topic-index="5"
    >
      <ThreeOneOne />
    </topic> -->

    <!-- <topic
      v-if="MainStore.appVersion == 'cityatlas'"
      :topic-name="'Stormwater'"
      :topic-icon="'fa-solid fa-tint'"
      :topic-index="6"
    >
      <Stormwater />
    </topic> -->

    <!-- <topic
      :topic-name="'Nearby Activity'"
      :topic-icon="'fa-solid fa-map-marker-alt'"
      :loading="!dataSourcesLoadedArray.includes('Nearby Activity')"
      :topic-index="7"
    >
      <KeepAlive>
        <NearbyActivity />
      </KeepAlive>
    </topic> -->

    <!-- <topic
      v-if="MainStore.appVersion == 'cityatlas'"
      :topic-name="'Districts'"
      :topic-icon="'fa-solid fa-clone'"
      :topic-index="8"
    >
      <Districts />
    </topic> -->
  </div>
</template>

<style>

.address-and-marker {
  margin-top: .5rem !important;
  margin-bottom: 0px !important;
}

</style>