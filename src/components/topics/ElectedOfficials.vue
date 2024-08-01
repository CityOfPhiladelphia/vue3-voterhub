<script setup>

import useTransforms from '@/composables/useTransforms';
const { nth, phoneNumber, titleCase } = useTransforms();

import { useElectedOfficialsStore } from '@/stores/ElectedOfficialsStore';
import { computed, getCurrentInstance } from 'vue';

import CustomPaginationLabels from '@/components/pagination/CustomPaginationLabels.vue';
import useTables from '@/composables/useTables';
const { paginationOptions } = useTables();

import VerticalTable from '@/components/VerticalTable.vue';

const ElectedOfficialsStore = useElectedOfficialsStore();

const instance = getCurrentInstance();
import i18nFromFiles from '@/i18n/i18n.js';
const messages = computed(() => {
  return i18nFromFiles.i18n.data.messages[instance.appContext.config.globalProperties.$i18n.locale];
})
if (import.meta.env.VITE_DEBUG == 'true') console.log('messages:', messages);

const formatMember = (person, termLength=4, districtLabel) => {
  // if (import.meta.env.VITE_DEBUG == 'true') console.log('person:', person);
  
  const website = '<a href="https://' + person.website + '" target="_blank">' + person.first_name +" " + person.last_name + "</a>";
  
  let party;
  if (person.party) {
    party = person.party;
  }

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
  if (party) {
    returnString += ` (${party})`;
  }
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

const districtCouncil = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office_label == "City Council";
  })[0];
  let value2 = formatMember(value, 4, 'Council District');
  return value2;
});

const councilAtLarge = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let councilAtLarge = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "city_council_at_large";
  });
  let theString = '';
  for (const [ index, councilMember ] of councilAtLarge.entries()) {
    theString += formatMember(councilMember, 4);
    index < councilAtLarge.length - 1 ? theString += '<br><br>' : theString += '';
  }
  return theString;
});

const mayor = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "mayor";
  })[0];
  let value2 = formatMember(value);
  return value2;
});

const districtAttorney = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "district_attorney";
  })[0];
  let value2 = formatMember(value);
  return value2;
});

const controller = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "city_controller";
  })[0];
  let value2 = formatMember(value);
  return value2;
});

const cityCommissioners = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let cityCommissioners = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "city_commissioners";
  });
  let theString = '';
  for (const [ index, commissioner ] of cityCommissioners.entries()) {
    theString += formatMember(commissioner, 4);
    index < cityCommissioners.length - 1 ? theString += '<br><br>' : theString += '';
  }
  return theString;
});

const sheriff = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "sheriff";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const registerOfWills = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "register_of_wills";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const stateHouseRepresentatives = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "state_house";
  })[0];
  const districtLabel = 'District';
  let value2 = formatMember(value, 4, districtLabel);
  return value2;
});

const stateSenator = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "state_senate";
  })[0];
  const districtLabel = 'District';
  let value2 = formatMember(value, 4, districtLabel);
  return value2;
});

const governor = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "governor";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const ltGovernor = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "lt_governor";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const attorneyGeneral = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "attorney_general";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const stateTreasurer = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "state_treasurer";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const auditorGeneral = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "auditor_general";
  })[0];
  let value2 = formatMember(value, 4);
  return value2;
});

const congressionalRepresentative = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let value = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "us_house";
  })[0];
  let value2 = formatMember(value, 2);
  return value2;
});

const senators = computed(() => {
  if (!ElectedOfficialsStore.electedOfficials.rows || !ElectedOfficialsStore.electedOfficials.rows.length) return null;
  let cityCommissioners = ElectedOfficialsStore.electedOfficials.rows.filter((item) => {
    return item.office == "us_senate";
  });
  let theString = '';
  for (const [ index, commissioner ] of cityCommissioners.entries()) {
    theString += formatMember(commissioner, 6);
    index < cityCommissioners.length - 1 ? theString += '<br><br>' : theString += '';
  }
  return theString;
});

const cityOfficialsData = computed(() => [
  {
    label: messages.value.electedOfficials.topic.verticalTable1.districtCouncilMember,
    value: districtCouncil.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.atLargeCouncilMembers,
    value: councilAtLarge.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.mayor,
    value: mayor.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.districtAttorney,
    value: districtAttorney.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.controller,
    value: controller.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.cityCommissioners,
    value: cityCommissioners.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.sheriff,
    value: sheriff.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable1.registerOfWills,
    value: registerOfWills.value,
  },
]);

const stateOfficialsData = computed(() => [
  {
    label: messages.value.electedOfficials.topic.verticalTable2.stateHouseRepresentatives,
    value: stateHouseRepresentatives.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.stateSenator,
    value: stateSenator.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.governor,
    value: governor.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.lieutenantGovernor,
    value: ltGovernor.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.attorneyGeneral,
    value: attorneyGeneral.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.stateTreasurer,
    value: stateTreasurer.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable2.auditorGeneral,
    value: auditorGeneral.value,
  },
]);

const federalOfficialsData = computed(() => [
  {
    label: messages.value.electedOfficials.topic.verticalTable3.congressionalRepresentative,
    value: congressionalRepresentative.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable3.senators,
    value: senators.value,
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable3.president,
    value: '<a href="https://www.whitehouse.gov/administration/president-biden/" target="_blank">Joseph Biden</a> (D)<br> \
              <a href="https://www.whitehouse.gov/administration/vice-president-harris/" target="_blank">Kamala Harris</a> (D)',
  },
]);

const wardData = computed(() => [
  {
    label: messages.value.electedOfficials.topic.verticalTable4.wardAndDivision,
    value: 'ward and division',
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable4.totalDivisions,
    value: 'total divisions',
  },
  {
    label: messages.value.electedOfficials.topic.verticalTable4.democraticWardLeader,
    value: 'democratic ward leader',
  },
]);

const wardDivisionData = computed(() => {
  return [];
})

const wardDivisionLength = computed(() => wardDivisionData.value && wardDivisionData.value.length ? wardDivisionData.value.length : 0);

const wardDivisionTableData = computed(() => {
  return {
    columns: [
      {
        label: messages.value.electedOfficials.topic.horizontalTable1.party,
        field: 'link',
      },
      {
        label: messages.value.electedOfficials.topic.horizontalTable1.name,
        field: 'business_name',
      },
      {
        label: messages.value.electedOfficials.topic.horizontalTable1.zipCode,
        field: 'licensetype',
      },
      {
        label: messages.value.electedOfficials.topic.horizontalTable1.yearElected,
        field: 'licensestatus',
      }
    ],
    rows: wardDivisionData.value || [],
  }
});

</script>

<template>
  <section>
    <div class="mb-5">
      <h5 class="subtitle is-5 vert-table-title">
        {{ $t('electedOfficials.topic.verticalTable1.title') }}
      </h5>
      <vertical-table
        :table-id="'cityOfficialsTable'"
        :data="cityOfficialsData"
      />
    </div>

    <div class="mb-5">
      <h5 class="subtitle is-5 vert-table-title">
        {{ $t('electedOfficials.topic.verticalTable2.title') }}
      </h5>
      <vertical-table
        :table-id="'stateOfficialsTable'"
        :data="stateOfficialsData"
      />
    </div>

    <div class="mb-5">
      <h5 class="subtitle is-5 vert-table-title">
        {{ $t('electedOfficials.topic.verticalTable3.title') }}
      </h5>
      <vertical-table
        :table-id="'federalOfficialsTable'"
        :data="federalOfficialsData"
      />
    </div>
      
    <div class="mb-5" v-html="$t('electedOfficials.topic.callout1.text')" />

    <div class="mb-5">
      <h5 class="subtitle is-5 vert-table-title">
        {{ $t('electedOfficials.topic.verticalTable4.title') }}
      </h5>
      <vertical-table
        :table-id="'wardTable'"
        :data="wardData"
      />
    </div>

    <!-- Li Permits Table -->
    <div class="data-section">
      <h2 class="subtitle mb-3 is-5 table-title">
        {{ $t('electedOfficials.topic.horizontalTable1.title') }}
        <font-awesome-icon
          v-if="ElectedOfficialsStore.loadingElectedOfficialsData"
          icon="fa-solid fa-spinner"
          spin
        />
        <span v-else>({{ wardDivisionLength }})</span>
      </h2>
      <div
        v-if="wardDivisionTableData.rows"
        class="horizontal-table"
      >
        <vue-good-table
          id="permits"
          :columns="wardDivisionTableData.columns"
          :rows="wardDivisionTableData.rows"
          :pagination-options="paginationOptions"
          style-class="table"
        >
          <template #emptystate>
            <div v-if="ElectedOfficialsStore.loadingElectedOfficialsData">
              Loading committeepeople... <font-awesome-icon
                icon="fa-solid fa-spinner"
                spin
              />
            </div>
            <div v-else>
              No committeepeople found
            </div>
          </template>
          <template #pagination-top="props">
            <custom-pagination-labels
              :mode="'pages'"
              :total="props.total"
              :perPage="5"
              @page-changed="props.pageChanged"
              @per-page-changed="props.perPageChanged"
            >
            </custom-pagination-labels>
          </template>
        </vue-good-table>
      </div>
      <!-- <a
        class="table-link"
        target="_blank"
        :href="`https://li.phila.gov/Property-History/search?address=${encodeURIComponent(MainStore.currentAddress)}`"
      >See all {{ permitsLength }} permits at L&I Property History <font-awesome-icon icon="fa-solid fa-external-link-alt" /></a> -->
    </div>

  </section>
</template>