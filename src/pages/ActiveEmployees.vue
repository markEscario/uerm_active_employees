<template>
  <q-banner v-if="pageStatus" inline-actions class="text-white bg-red">
    {{ pageStatus }}
    <template v-slot:action>
      <q-btn flat color="white" />
    </template>
  </q-banner>
  <ViewEmployeeModal :fModal="medium" :vData="resultEmps" @close="closeDialog" @hide="closeDialog" />
  <ViewEmployeeTableModal :tableModal="table_modal" :employeeTable="resultEmployees" @close="closeDialog"
    @hide="closeDialog" />
  <div class="q-pa-md">
    <div class="q-pa-sm">
      <q-form v-if="!pageStatus" @submit="submitFilter" class="q-gutter-md" ref="form">
        <div class="q-gutter-md row items-start s-input q-ml-sm">
          <q-input class="text-h6" outlined v-model="search.filterData" placeholder="Search Employee" dense
            hint="(Employee No / Last Name / First Name / Department / Position)" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" debounce="300" />
        </div>
        <br>
        <q-btn class="q-mr-md s-btn" label="Submit" type="submit" color="primary" :disable="disabled" />
      </q-form>
    </div>
    <q-separator />
  </div>

  <div class="q-ml-lg q-pa-md" v-if="searchedEmployees.length >= 1">Filter Count: <b>{{ searchedEmployees.length
  }}
      <q-btn class="q-ml-lg" color="primary" label="Tabular View" @click="viewTableModal" />
    </b>
    <div class="q-gutter-md row items-start s-input">
      <q-input outlined placeholder="Employee Class" v-model="employee_class" @keyup="filterClass" dense />
      <q-input outlined placeholder="Department" v-model="department" @keyup="filterDepartment" dense />
      <q-input outlined placeholder="Position" v-model="employee_position" @keyup="filterPosition" dense />
      <q-input outlined placeholder="Status" v-model="employee_status" @keyup="filterStatus" dense />
    </div>
  </div>

  <div class="row" style="width: 1400px;">
    <div class="col-md-3 q-pa-lg" v-for="resultEmployee in paginateEmployees" :key="resultEmployee">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>
          <b class="text-subtitle2">{{ resultEmployee.CODE }}</b> {{ resultEmployee.NAME }}
        </q-toolbar-title>
      </q-toolbar>

      <q-list bordered>
        <q-item class="q-my-sm">
          <q-item-section avatar>
            <q-avatar size="100px">
              <img :src="'http://10.107.11.169/getpic?i=' + resultEmployee.CODE">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="dept-label text-uppercase text-subtitle2 bg-lime-3"><b>{{ resultEmployee.POS_DESC
            }}</b>
            </q-item-label>
            <q-item-label class="text-caption">{{ resultEmployee.DEPT_DESC }}</q-item-label>
            <q-item-label class="text-caption">{{ resultEmployee.EMP_CLASS_CODE + ' ' + resultEmployee.EMP_STATUS_DESC
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="resultEmployee.IS_ACTIVE" :active="active" active-class="bg-teal-1 text-grey-8">
          <q-item-section avatar>
            <q-icon v-if="resultEmployee.GENDER === 'M'" name="face_6" />
            <q-icon v-else name="face_3" />
          </q-item-section>
          <q-item-section>
            <q-btn flat rounded color="primary" label="PROFILE" @click="viewProfile(resultEmployee)" />
          </q-item-section>
          <q-item-section side>{{ resultEmployee.IS_ACTIVE ? 'ACTIVE' : 'IN-ACTIVE'
          }}</q-item-section>
        </q-item>
        <q-item v-else :active="active" active-class="bg-red-2 text-grey-8">
          <q-item-section avatar>
            <q-icon v-if="resultEmployee.GENDER === 'M'" name="face_6" />
            <q-icon v-else name="face_3" />
          </q-item-section>
          <q-item-section>
            <q-btn flat rounded color="primary" label="PROFILE" />
          </q-item-section>
          <q-item-section side>{{ resultEmployee.IS_ACTIVE ? 'ACTIVE' : 'IN-ACTIVE'
          }}</q-item-section>
        </q-item>
      </q-list>
    </div>
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
        Sorry, No records found. Please try again
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div v-if="searchedEmployees.length >= 5" class="q-pa-lg flex flex-center">
    <q-pagination v-model="page" :min="currentPage" :max="Math.ceil(resultEmployees.length / totalPages)" :input="true"
      input-class="text-orange-10" size="2em" />
  </div>
  <router-view />
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { mapGetters } from 'vuex'
import ViewEmployeeModal from '../components/ViewEmployeeModal.vue'
import ViewEmployeeTableModal from '../components/ViewEmployeeTableModal.vue'


export default defineComponent({
  name: 'ActiveEmployees',
  components: {
    ViewEmployeeModal,
    ViewEmployeeTableModal
  },
  setup() {
    const $q = useQuasar()
    return {
      filter: ref(''),
      tab: ref('mails'),
      model: ref(null),
      active: ref(true),
      visible: ref(false)
    }
  },
  data() {
    return {
      campus: [
        '',
        'UE Caloocan',
        'UE Manila',
        'UERM'
      ],
      search: {
        filterData: '',
      },
      filterAlert: false,
      department: '',
      employee_class: '',
      employee_position: '',
      employee_status: '',
      title: '',
      resultCount: '',
      loading: false,
      resultEmployees: [],
      resultEmps: {},
      disabled: false,
      medium: false,
      table_modal: false,
      page: 1,
      currentPage: 1,
      nextPage: null,
      totalPages: 8,
    }
  },

  computed: {
    ...mapGetters({
      employees: 'activeEmployees/employees',
      pageStatus: 'activeEmployees/pageStatus',
      searchStatus: 'activeEmployees/searchStatus',
      searchedEmployees: 'activeEmployees/searchedEmployees'
    }),
    paginateEmployees() {
      return this.resultEmployees.slice((this.page - 1) * this.totalPages, (this.page - 1) * this.totalPages + this.totalPages)
    }

  },
  methods: {
    async submitFilter() {
      this.disabled = true
      this.visible = true
      this.resultEmployees = ''
      let data = {
        filterData: this.search.filterData,
      }
      const result = await this.$store.dispatch('activeEmployees/getSearchedEmployees', data)
      result.status === 200 ?
        setTimeout(() => {
          this.disabled = false

          this.resultEmployees = this.searchedEmployees
          result.data.length <= null ? this.filterAlert = true : false
          this.visible = false
        }, 1000)
        : this.searchStatus
    },

    viewProfile(profile) {
      this.medium = true;
      this.resultEmps = profile
    },

    viewTableModal() {
      this.table_modal = true;
    },

    closeDialog() {
      this.medium = false
      this.table_modal = false
    },

    filterClass() {
      if (this.employee_class === '') {
        this.resultEmployees = this.searchedEmployees
      } else {
        this.resultEmployees = this.resultEmployees
          .filter(resultEmployee => typeof resultEmployee.EMP_CLASS_DESC === 'string' ?
            resultEmployee.EMP_CLASS_DESC.toLowerCase().includes(this.employee_class.toLowerCase()) :
            this.resultEmployees = this.searchedEmployee)
      }
    },

    filterDepartment() {
      if (this.department === '') {
        this.resultEmployees = this.searchedEmployees
      } else {
        this.resultEmployees = this.resultEmployees
          .filter(resultEmployee => typeof resultEmployee.DEPT_DESC === 'string' ?
            resultEmployee.DEPT_DESC.toLowerCase().includes(this.department.toLowerCase()) :
            this.resultEmployees = this.searchedEmployees)
      }
    },

    filterPosition() {
      if (this.employee_position === '') {
        this.resultEmployees = this.searchedEmployees
      } else {
        this.resultEmployees = this.resultEmployees
          .filter(resultEmployee => typeof resultEmployee.POS_DESC === 'string' ?
            resultEmployee.POS_DESC.toLowerCase().includes(this.employee_position.toLowerCase()) :
            this.resultEmployees = this.searchedEmployee)
      }
    },

    filterStatus() {
      if (this.employee_status === '') {
        this.resultEmployees = this.searchedEmployees
      } else {
        this.resultEmployees = this.resultEmployees
          .filter(resultEmployee => typeof resultEmployee.EMP_STATUS_DESC === 'string' ?
            resultEmployee.EMP_STATUS_DESC.toLowerCase().includes(this.employee_status.toLowerCase()) :
            this.resultEmployees = this.searchedEmployee)
      }
    },

  }
})

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
  margin-top: -34px;
}

.code-label {
  font-size: 14px;
}

img {
  -webkit-user-drag: none;
}
</style>