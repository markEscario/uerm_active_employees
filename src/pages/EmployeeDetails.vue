<template>
  <q-banner v-if="pageStatus" inline-actions class="text-white bg-red">
    {{ pageStatus }}
    <template v-slot:action>
      <q-btn flat color="white" />
    </template>
  </q-banner>
  <div class="q-pa-md">
    <div class="q-pa-sm">
      <q-form v-if="!pageStatus" @submit="submitFilter" class="q-gutter-md" ref="form">
        <div class="q-gutter-md row items-start s-input q-ml-sm">
          <q-select outlined v-model="search.campus" :options="campus" label="CAMPUS" hint="Campus" />
          <q-select outlined v-model="search.gender" :options="employee_gender" label="ANY" hint="Gender" />
          <q-select outlined v-model="search.employee_department" :options="department" class="text-h5" label="ANY"
            hint="Department" />
          <q-select outlined v-model="search.employee_position" :options="positions" class="text-h6" label="ANY"
            hint="Position" />
        </div>
        <q-btn class="q-mr-md s-btn" label="Submit" type="submit" color="primary" />
      </q-form>
    </div>
    <q-separator />
  </div>

  <div class="q-ml-lg q-pa-md" v-if="resultEmployees.length >= 1">Filter: <b>{{ resultEmployees.length
  }}</b>
    <q-btn class="q-ml-lg" color="primary" icon-right="archive" label="Export to Excel" no-caps @click="exportTable" />
  </div>

  <div class="q-pa-md" v-if="resultEmployees.length >= 1">
    <q-table title="UERM Employee Details" :rows="resultEmployees" :columns="columns" :filter="filter" row-key="name"
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
  <q-inner-loading :showing="visible" class="q-mr-xl">
    <q-spinner color="primary" size="8em" />
  </q-inner-loading>
  <q-dialog v-model="filterAlert">
    <q-card>
      <q-card-section>
        <div class="text-h6">UERMMMCI FILTER</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Sorry, No results found. Please try again
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
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
        gender: '',
        employee_department: '',
        employee_position: ''
      },
      campus: [
        '',
        'UERM',
        'UE Manila',
        'UE Caloocan'
      ],
      employee_gender: [
        ' ',
        'MALE',
        'FEMALE'
      ],
      pageStatus: '',
      filterAlert: false,
      searchStatus: '',
      title: '',
      resultCount: '',
      loading: false,
      columns,
      resultEmployees: [],
      rows: []
    }
  },

  computed: {
    ...mapGetters({
      employees: 'activeEmployees/employees',
      searchedEmployees: 'activeEmployees/searchedEmployees',
      resultForStateFilters: 'activeEmployees/resultForStateFilter',
      department: 'activeEmployees/department',
      positions: 'activeEmployees/positions',
      employeeStatus: 'activeEmployees/employeeStatus',
      employeeClass: 'activeEmployees/employeeClass',
      employeeDetails: 'activeEmployees/employeeDetails',
    })
  },
  created() {
    this.getDepartment()
    this.getPositions()
    // this.getEmployeeStatus()
    // this.getEmployeeClass()
  },

  methods: {

    async getDepartment() {
      return await this.$store.dispatch('activeEmployees/getDepartment')
    },
    async getPositions() {
      return await this.$store.dispatch('activeEmployees/getPositions')
    },
    async getEmployeeStatus() {
      return await this.$store.dispatch('activeEmployees/getEmployeeStatus')
    },
    async getEmployeeClass() {
      return await this.$store.dispatch('activeEmployees/getEmployeeClass')
    },
    async submitFilter() {
      this.visible = true
      this.resultEmployees = ''
      let data = {
        campus: this.search.campus === 'UE Caloocan' ? '1' : this.search.campus === 'UE Manila' ? '0' : '2',
        gender: this.search.gender,
        department: this.search.employee_department,
        position: this.search.employee_position
      }

      const result = await this.$store.dispatch('activeEmployees/getSearchedEmployeeDetails', data)
      setTimeout(() => {
        this.resultEmployees = this.employeeDetails
        // result.data.length <= 0 ? this.filterAlert = true : false
        this.visible = false
      }, 1000)
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
        this.resultEmployees.map(row => columns.map(col => this.wrapCsvValue(
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
    name: 'ACTIVE',
    align: 'left',
    label: 'ACTIVE',
    field: 'IS_ACTIVE',
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