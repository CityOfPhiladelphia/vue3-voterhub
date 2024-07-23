<script setup>

import useTransforms from '@/composables/useTransforms';
const { nth, phoneNumber, titleCase } = useTransforms();

import { useElectedOfficialsStore } from '@/stores/ElectedOfficialsStore';
import { computed } from 'vue';

import VerticalTable from '@/components/VerticalTable.vue';

const ElectedOfficialsStore = useElectedOfficialsStore();

const formatMember = (person, termLength, districtLabel) => {
  if (import.meta.env.VITE_DEBUG == 'true') console.log('person:', person);
  
  const website = '<a href="https://' + person.website + '" target="_blank">' + person.first_name +" " + person.last_name + "</a>";
  
  let district;
  if (person.district != 0 && districtLabel) {
    district = nth(person.district);
  } else {
    district = '';
  }

  let addressLine1;
  if (person.main_contact_address_1) {
    addressLine1 = person.main_contact_address_1 || '';
  }
  let addressLine2;
  if (person.main_contact_address_2) {
    addressLine2 = person.main_contact_address_2 || '';
  }

  let city;
  if (person.main_contact_city != 'Philadelphia') {
    city = person.main_contact_city;
  }
  const state = person.main_contact_state || '';
  const zip = person.main_contact_zip || '';
  
  const phone1 = phoneNumber(person.main_contact_phone_1) || '';
  const phone2 = phoneNumber(person.main_contact_phone_2) || '';
  const fax = 'F: '+ phoneNumber(person.main_contact_fax) || '';
  const email = '<b><a href=mailto:"' + person.email + '">' + person.email + '</a></b>';
  const term = 'Current Term: ' + (person.next_election-termLength) + ' - ' + person.next_election;

  let returnString = website;
  if (district) {
    returnString += ' - ' + district + " " + districtLabel + '<br>';
  } else {
    returnString += '<br>';
  }

  if (addressLine1) {
    returnString += addressLine1 + '<br>';
  }
  if (addressLine2) {
    returnString += addressLine2 + '<br>';
  }

  if (city) {
    returnString += city + ', ' + state + ' ' + zip + '<br>';
  }
  
  returnString += phone1;
  if (phone2) {
    returnString += ", " + phone2 + '<br>';
  } else {
    returnString += '<br>';
  }
  if (person.main_contact_fax && person.main_contact_fax != '0') {
    returnString += fax + '<br>';
  }
  if (person.email) {
    returnString += email + '<br>';
  }
  returnString += term;

  return returnString;
}

const electedOfficial = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office_label == "City Council";
  })[0];
  let value2 = formatMember(value, 4, 'Council District');
  return value2;
});

// const council = computed(() => {
//   if (electedOfficials.value) {
//     let value = electedOfficials.value.filter((item) => {
//       return item.office_label == "City Council";
//     })[0];
//     if (import.meta.env.VITE_DEBUG == 'true') console.log('value:', value);
//     return value;
//   } else {
//     return null;
//   }
// });

// const councilMember = computed(() => {
//   if (council.value && council.value[0]) {
//     return '<a href="http://' + council.value[0].website + '" target="_blank">' +
//       council.value[0].first_name +" " +council.value[0].last_name + " - " + nth(council.value[0].district) + " Council District </a>";
//   }
// });

// const office = computed(() => {
//   if (council.value && council.value[0]) {
//     return council.value[0].main_contact_address_2 + '<br>' +
//       phoneNumber(council.value[0].main_contact_phone_1) + ", " + phoneNumber(council.value[0].main_contact_phone_2) + '<br>\
//       F: '+ phoneNumber(council.value[0].main_contact_fax) + ' <br>\
//       <b><a href=mailto:"' + council.value[0].email + '">' + council.value[0].email + '</a></b>';
//   }
// });

// const term = computed(() => {
//   if (council.value && council.value[0]) {
//     return council.value[0].next_election - 4 + ' - ' + council.value[0].next_election;
//   }
// });

const electedRepsData = computed(() => [
  {
    label: 'District Council Member',
    value: electedOfficial.value,
  },
  // {
  //   label: 'City Hall Office',
  //   value: office.value,
  // },
  // {
  //   label: 'Current Term',
  //   value: term.value,
  // }
]);

</script>

<template>
  <section>
    <h5 class="subtitle is-5 vert-table-title">
      {{ $t('electedOfficials.topic.verticalTable1.title') }}
    </h5>
    <vertical-table
      :table-id="'electedRepsTable'"
      :data="electedRepsData"
    />
  </section>
</template>