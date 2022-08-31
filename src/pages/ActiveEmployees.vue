<template>
  <ViewEmployeeModal :fModal="medium" :vData="resultEmps" :vServiceRecords="records" @close="closeDialog"
    @hide="closeDialog" />
  <div class="q-pa-lg">
    <q-form v-if="!pageStatus" @submit="submitFilter" class="q-gutter-md" ref="form">
      <div class="q-gutter-md row items-start s-input q-ml-sm">
        <q-input class="text-h5 q-ml-sm" outlined v-model="search.filterData" ref="inputRef" label="Search Employee"
          :rules="[rule1, rule2]" hint="(Employee No. / Lastname / Firstname / Department / Position)">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="search.filterData = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
      <br>
      <q-btn class="q-mb-md s-btn" label="Submit" type="submit" color="primary" />
    </q-form>

    <q-separator />
  </div>

  <div class="q-ml-lg" v-if="searchedEmployees.length >= 1">Filter Count: <b class="text-h6">{{
      searchedEmployees.length
  }}</b>
  </div>

  <div class="row result-pos" style="width: 1400px;">
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
              <img :src="imageUrl + resultEmployee.CODE">
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

        <q-item v-if="resultEmployee.IS_ACTIVE" :active="active" active-class="bg-teal-1 text-grey-8" clickable
          @click="viewProfile(resultEmployee)" v-ripple>
          <q-item-section avatar>
            <q-icon v-if="resultEmployee.GENDER === 'M'" name="face_6" />
            <q-icon v-else name="face_3" />
          </q-item-section>
          <q-item-section>PROFILE</q-item-section>
          <q-item-section side>{{ resultEmployee.IS_ACTIVE ? 'ACTIVE' : 'IN-ACTIVE'
          }}</q-item-section>
        </q-item>

        <q-item v-else :active="active" active-class="bg-red-2 text-grey-8" clickable
          @click="viewProfile(resultEmployee)" v-ripple>
          <q-item-section avatar>
            <q-icon v-if="resultEmployee.GENDER === 'M'" name="face_6" />
            <q-icon v-else name="face_3" />
          </q-item-section>
          <q-item-section>PROFILE</q-item-section>
          <q-item-section side>{{ resultEmployee.IS_ACTIVE ? 'ACTIVE' : 'IN-ACTIVE'
          }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <q-inner-loading :showing="visible" class="q-mr-xl">
    <q-spinner color="primary" size="8em" />
  </q-inner-loading>
  <div v-if="filterMessage" class="q-ml-lg q-pr-md">
    <q-banner inline-actions rounded class="bg-red text-white">
      {{ filterMessage }}
      <template v-slot:action>
      </template>
    </q-banner>
  </div>
  <div v-if="pageStatus" class="q-ml-lg q-pr-md">
    <q-banner inline-actions rounded class="bg-red text-white">
      {{ pageStatus }}
      <template v-slot:action>
      </template>
    </q-banner>
  </div>
  <div v-if="resultEmployees.length >= 5" class="q-pa-lg flex flex-center">
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
import FILTER from '../constants'

export default defineComponent({
  name: 'ActiveEmployees',
  components: {
    ViewEmployeeModal
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
          resolve(!!val || '* Required')
        })
      },
      rule2(val) {
        return new Promise((resolve, reject) => {
          resolve(val.length > 1 || 'Sorry, Minimum is 2 Letters')
        })
      },
    }
  },
  data() {
    return {
      search: {
        filterData: '',
      },
      pageStatus: '',
      filterMessage: '',
      filterAlert: false,
      title: '',
      loading: false,
      resultEmployees: [],
      records: [],
      resultEmps: {},
      medium: false,
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
      searchedEmployees: 'activeEmployees/searchedEmployees',
      serviceRecords: 'activeEmployees/serviceRecords',
      imageUrl: 'activeEmployees/imageUrl'
    }),
    paginateEmployees() {
      return this.resultEmployees.slice((this.page - 1) * this.totalPages, (this.page - 1) * this.totalPages + this.totalPages)
    }

  },
  methods: {
    async submitFilter() {
      this.resultEmployees = ''
      this.filterMessage = ''
      let data = {
        filterData: this.search.filterData,
      }
      if (data.filterData.length >= 2) {
        this.visible = true
        const result = await this.$store.dispatch('activeEmployees/getSearchedEmployees', data)
        result.status === 200 ?
          setTimeout(() => {
            this.resultEmployees = this.searchedEmployees
            result.data.length <= 0 ? this.filterMessage = FILTER.FILTER_ERROR : ''
            this.visible = false
          }, 500)
          : this.pageStatus = FILTER.API_ERROR
      }
    },

    async viewProfile(profile) {
      this.medium = true;
      this.resultEmps = profile
      let data = {
        employeeCode: profile.CODE
      }
      const result = await this.$store.dispatch('activeEmployees/getEmployeeServiceRecords', data)
      this.records = this.serviceRecords
    },

    closeDialog() {
      this.medium = false
      this.table_modal = false
    }

  }
})

</script>
<style scoped>
.q-input {
  width: 45em;
}

.result-pos {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

img {
  -webkit-user-drag: none;
}
</style>