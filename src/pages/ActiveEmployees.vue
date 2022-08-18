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
      <q-form v-if="!pageStatus" class="q-gutter-md" ref="form">
        <div class="q-gutter-md row items-start s-input q-ml-sm">
          <q-input class="text-h5" outlined v-model="search.filterData" @keyup="submitFilter" ref="inputRef"
            label="Search Employee" :rules="[rule1, rule2]"
            hint="(Employee No. / Lastname / Firstname / Department / Position / Campus)">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click="search.filterData = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
      </q-form>
    </div>
    <q-separator />
  </div>

  <div class="q-pa-lg" v-if="searchedEmployees.length >= 1">Filter Count: <b>{{ searchedEmployees.length }}
      <q-btn class="q-ml-lg" color="primary" icon="table_view" label="Table View" @click="viewTableModal" />
    </b>
    <div class="q-gutter-md row q-mt-sm" v-if="searchedEmployees.length >= 30">
      <q-input class="text-h5" outlined label="Employee Name" v-model="employee_name" @keyup="filterEmployeeName" />
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
    const inputRef = ref(null)
    return {
      filter: ref(''),
      inputRef,
      tab: ref('mails'),
      active: ref(true),
      visible: ref(false),
      rule1(val) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(!!val || '* Required')
          }, 300)
        })
      },
      rule2(val) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(val.length > 1 || 'Sorry, Minimum is 2 Letters')
          }, 300)
        })
      },
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
      pageStatus: '',
      filterAlert: false,
      department: '',
      employee_name: '',
      employee_position: '',
      employee_status: '',
      title: '',
      resultCount: '',
      loading: false,
      resultEmployees: [],
      resultEmps: {},
      btn: false,
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
      searchStatus: 'activeEmployees/searchStatus',
      searchedEmployees: 'activeEmployees/searchedEmployees'
    }),
    paginateEmployees() {
      return this.resultEmployees.slice((this.page - 1) * this.totalPages, (this.page - 1) * this.totalPages + this.totalPages)
    }

  },
  methods: {
    async submitFilter() {
      this.btn = true

      this.resultEmployees = ''
      let data = {
        filterData: this.search.filterData,
      }
      if (data.filterData.length >= 2) {
        this.visible = true
        const result = await this.$store.dispatch('activeEmployees/getSearchedEmployees', data)
        result.status === 200 ?
          setTimeout(() => {
            this.disabled = false

            this.resultEmployees = this.searchedEmployees
            result.data.length <= 0 ? this.filterAlert = true : false
            this.visible = false
          }, 500)
          : this.pageStatus = 'API ERROR'
      }
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

    filterEmployeeName() {
      if (this.employee_name === '') {
        this.resultEmployees = this.searchedEmployees
      } else {
        this.resultEmployees = this.resultEmployees
          .filter(resultEmployee => typeof resultEmployee.NAME === 'string' ?
            resultEmployee.NAME.replace(/,/g, '').toLowerCase().includes(this.employee_name.toLowerCase()) :
            this.resultEmployees = this.searchedEmployee)
      }
    }

  }
})

</script>
<style scoped>
.q-input {
  width: 20em;
}

img {
  -webkit-user-drag: none;
}
</style>