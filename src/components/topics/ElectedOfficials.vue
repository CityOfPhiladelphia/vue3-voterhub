<script setup>

import useTransforms from '@/composables/useTransforms';
const { nth, phoneNumber } = useTransforms();

import { useElectedOfficialsStore } from '@/stores/ElectedOfficialsStore';
import { computed } from 'vue';

import VerticalTable from '@/components/VerticalTable.vue';

const ElectedOfficialsStore = useElectedOfficialsStore();

const electedOfficials = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  return ElectedOfficialsStore.electedOfficials.rows;
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

const electedRepsData = computed(() => [
  {
    label: 'District Council Member',
    value: councilMember.value,
  },
  {
    label: 'City Hall Office',
    value: office.value,
  },
  {
    label: 'Current Term',
    value: term.value,
  }
]);

</script>

<template>

  <h5 class="subtitle is-5 table-title">
    Elected Representatives
  </h5>
  <vertical-table
    :table-id="'electedRepsTable'"
    :data="electedRepsData"
  />

</template>