<template>
  <q-dialog v-if="tableModal" :model-value="true">
    <q-card style="width: 1800px; max-width: 380vw;">
      <div class="q-ml-lg q-pa-md" v-if="employeeTable.length >= 1">Filter: <b>{{ employeeTable.length
      }}</b>
        <q-btn class="q-ml-lg" color="primary" icon-right="archive" label="Export to Excel" no-caps
          @click="exportTable" />
      </div>

      <div class="q-pa-md" v-if="employeeTable.length >= 1">
        <q-table title="UERM Employee Details" :rows="employeeTable" :columns="columns" :filter="filter" row-key="name"
          bordered>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-NAME="props">
            <q-td :props="props">{{ props.row.NAME }}
              <q-tooltip>
                <q-avatar size="100px">
                  <img :src="'http://10.107.11.169/getpic?i=' + props.row.CODE">
                </q-avatar>
              </q-tooltip>
            </q-td>
          </template>
        </q-table>

      </div>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>

  </q-dialog>

</template>

<script>
import { defineComponent, ref } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ActiveEmployees',
  setup() {
    const $q = useQuasar()
    return {
      filter: ref(''),
      tab: ref('mails'),
      model: ref(null),
      active: ref(true),
      group: ref('op1'),
      visible: ref(false),
      activeEmp: [
        {
          label: 'YES',
          value: '1'
        },
        {
          label: 'NO',
          value: '0'
        },
        {
          label: 'ANY',
          value: ''
        }
      ]
    }
  },
  data() {
    return {
      search: {
        campus: '',
      },
      campus: [
        '',
        'UE Caloocan',
        'UE Manila',
        'UERM'
      ],
      employee_gender: [
        ' ',
        'MALE',
        'FEMALE'
      ],
      filterAlert: false,
      searchStatus: '',
      title: '',
      resultCount: '',
      loading: false,
      columns,
      // employeeTable: [],
      rows: []
    }
  },
  props: ['employeeTable', 'tableModal'],
  computed: {
    ...mapGetters({
      employees: 'activeEmployees/employees',
      pageStatus: 'activeEmployees/pageStatus',
      searchedEmployees: 'activeEmployees/searchedEmployees',
      resultForStateFilters: 'activeEmployees/resultForStateFilter',
      department: 'activeEmployees/department',
      positions: 'activeEmployees/positions',
      employeeStatus: 'activeEmployees/employeeStatus',
      employeeClass: 'activeEmployees/employeeClass',
      employeeDetails: 'activeEmployees/employeeDetails',
    })
  },

  methods: {

    close() {
      this.$emit('close')
    },

    wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      return `"${formatted}"`
    },
    exportTable() {
      const content = [columns.map(col => this.wrapCsvValue(col.label))].concat(
        this.employeeTable.map(row => columns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }

  }
})

const columns = [
  {
    name: 'CODE',
    required: true,
    label: 'CODE',
    align: 'left',
    field: 'EmployeeCode',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'FIRSTNAME',
    align: 'left',
    label: 'FIRSTNAME',
    field: 'FIRSTNAME',
    sortable: true
  },
  {
    name: 'MIDDLENAME',
    align: 'left',
    label: 'MIDDLENAME',
    field: 'MIDDLENAME',
    sortable: true
  },
  {
    name: 'LASTNAME',
    align: 'left',
    label: 'LASTNAME',
    field: 'LASTNAME',
    sortable: true
  },
  {
    name: 'EXT NAME',
    align: 'left',
    label: 'EXT NAME',
    field: 'EXTNAME',
    sortable: true
  },
  {
    name: 'NAME',
    align: 'left',
    label: 'NAME',
    field: 'NAME',
    sortable: true
  },
  {
    name: 'GENDER',
    align: 'left',
    label: 'GENDER',
    field: 'GENDER',
    sortable: true
  },
  {
    name: 'BIRTHDATE',
    align: 'left',
    label: 'BIRTHDATE',
    field: 'BDATE',
    sortable: true
  },
  {
    name: 'AGE',
    align: 'left',
    label: 'AGE',
    field: 'AGE',
    sortable: true
  },
  {
    name: 'EMAIL',
    align: 'left',
    label: 'EMAIL',
    field: 'EMAIL',
    sortable: true
  },
  {
    name: 'ADDRESS',
    align: 'left',
    label: 'ADDRESS',
    field: 'ADDRESS',
    sortable: true
  },
  {
    name: 'CONTACT ADDRESS',
    align: 'left',
    label: 'CONTACT ADDRESS',
    field: 'CONTACT_ADDRESS',
    sortable: true
  },
  {
    name: 'MOBILE NO.',
    align: 'left',
    label: 'MOBILE NO.',
    field: 'MOBILENO',
    sortable: true
  },
  {
    name: 'RELIGION',
    align: 'left',
    label: 'RELIGION',
    field: 'RELIGION_DESC',
    sortable: true
  },
  {
    name: 'DEPARTMENT',
    align: 'left',
    label: 'DEPARTMENT',
    field: 'DEPT_DESC',
    sortable: true
  },
  {
    name: 'POSITION',
    align: 'left',
    label: 'POSITION',
    field: 'POS_DESC',
    sortable: true
  },
  {
    name: 'GROUP',
    align: 'left',
    label: 'GROUP',
    field: 'GROUP',
    sortable: true
  },
  {
    name: 'CLASS',
    align: 'left',
    label: 'CLASS',
    field: 'EMP_CLASS_DESC',
    sortable: true
  },
  {
    name: 'STATUS',
    align: 'left',
    label: 'STATUS',
    field: 'EMP_STATUS_DESC',
    sortable: true
  },
  {
    name: 'DATE HIRED',
    align: 'left',
    label: 'DATE HIRED',
    field: 'HIRED',
    sortable: true
  },
  {
    name: 'DATE REGULARIZED',
    align: 'left',
    label: 'DATE REGULARIZED',
    field: 'REGULARIZED',
    sortable: true
  },
  {
    name: 'DATE RESIGNED',
    align: 'left',
    label: 'DATE RESIGNED',
    field: 'RESIGNED',
    sortable: true
  },
  {
    name: 'DATE RETIRED',
    align: 'left',
    label: 'DATE RETIRED',
    field: 'RETIRE DATE',
    sortable: true
  },
  {
    name: 'YEARS OF SERVICE',
    align: 'left',
    label: 'YEARS OF SERVICE',
    field: 'SERVICE YEARS',
    sortable: true
  },
  {
    name: 'DEGREE',
    align: 'left',
    label: 'DEGREE',
    field: 'DiplomaDegreeHonor',
    sortable: true
  },
  {
    name: 'CIVIL STATUS',
    align: 'left',
    label: 'CIVIL STATUS',
    field: 'CIVIL_STATUS_DESC',
    sortable: true
  },
  {
    name: 'BOARD RATING',
    align: 'left',
    label: 'BOARD RATING',
    field: 'BOARD',
    sortable: true
  },
  {
    name: 'TIN',
    align: 'left',
    label: 'TIN',
    field: 'TIN',
    sortable: true
  }
]

</script>
<style scoped>
.q-input {
  width: 20em;
}

.q-select {
  width: 20em;
}

.s-input {
  margin-top: 20px;
  margin-left: 1px;
}

.dept-label {
  font-size: 12px;
  margin-top: -50px;
}

.code-label {
  font-size: 14px;
}
</style>