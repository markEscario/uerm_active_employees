<template>
  <q-dialog v-if="fModal" :model-value="true">
    <q-card style="width: 1500px; max-width: 380vw;">
      <div class="row flex flex-center">
        <div class="q-pa-md" style="width: 1950px">
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>
              <q-icon name="account_circle" size="30px"></q-icon> {{ vData.CODE + ' - ' + vData.NAME }}
            </q-toolbar-title>
          </q-toolbar>
          <q-list bordered>
            <q-item class="q-my-sm">

              <q-avatar size="190px">
                <img :src="'http://10.107.11.169/getpic?i=' + vData.CODE">
              </q-avatar>

              <q-item-section class="q-ml-md">
                <div class="row bg-grey-2 q-pa-sm rounded-borders row-pad">
                  <div class="col-md-3">
                    <b>FIRST NAME</b>
                    <div>
                      {{ vData.FIRSTNAME }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>MIDDLE NAME</b>
                    <div>
                      {{ vData.MIDDLENAME }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>LAST NAME</b>
                    <div>
                      {{ vData.LASTNAME }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>GENDER</b>
                    <div>
                      {{ vData.GENDER === 'M' ? 'MALE' : 'FEMALE' }}
                    </div>
                  </div>
                </div>
                <div class="row bg-grey-2 q-pa-sm rounded-borders row-pad">
                  <div class="col-md-3">
                    <b>BIRTH DATE</b>
                    <div>
                      {{ moment(vData.BDATE).format('MMMM d, YYYY') }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>AGE</b>
                    <div>
                      {{ vData.AGE }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>CITIZENSHIP</b>
                    <div>
                      {{ vData.CITIZEN_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>RELIGION</b>
                    <div>
                      {{ vData.RELIGION_DESC }}
                    </div>
                  </div>

                </div>
                <q-separator />
                <div class="row bg-grey-2 q-pa-sm rounded-borders">
                  <div class="col-md-3">
                    <b>EMAIL</b>
                    <div>
                      {{ vData.EMAIL }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>MIDDLE NAME</b>
                    <div>
                      {{ vData.MIDDLENAME }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>ADDRESS</b>
                    <div>
                      {{ vData.ADDRESS }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>MOBILE NO.</b>
                    <div>
                      {{ vData.MOBILENO }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <div class="row bg-grey-2 q-pa-sm rounded-borders">
                  <div class="col-md-3">
                    <b>DEPARTMENT</b>
                    <div>
                      {{ vData.DEPT_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>POSITION</b>
                    <div>
                      {{ vData.POS_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>HIRED</b>
                    <div>
                      {{ moment(vData.HIRED).format('MMMM d, YYYY') }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>REGULARIZED</b>
                    <div>
                      {{ moment(vData.REGULARIZED).format('MMMM d, YYYY') }}
                    </div>
                  </div>
                </div>
                <q-separator />
                <div class="row bg-grey-2 q-pa-sm rounded-borders">
                  <div class="col-md-3">
                    <b>EMPLOYEE CLASS</b>
                    <div>
                      {{ vData.DEPT_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>EMPLOYEE STATUS</b>
                    <div>
                      {{ vData.POS_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>SERVICE YEARS</b>
                    <div>
                      {{ vData['SERVICE YEARS'] }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>DEGREE</b>
                    <div>
                      {{ vData.DiplomaDegreeHonor }}
                    </div>
                  </div>
                </div>
              </q-item-section>

            </q-item>

            <q-separator />
            <q-item-label header>SERVICE RECORD</q-item-label>
            <q-item v-for="record in vServiceRecords" :key="record">
              <q-item-section>
                <div class="q-pa-sm">{{ record.TYPE }}</div>
                <div class="row bg-grey-2 q-pa-sm rounded-borders row-pad">
                  <div class="col-md-3">
                    <b>POSITION</b>
                    <div>
                      {{ record.Position }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>DEPARTMENT</b>
                    <div>
                      {{ record.DEPT_DESC }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>FROM</b>
                    <div>
                      {{ moment(record.DATE_FROM).format('MMMM d, YYYY') }}
                    </div>
                  </div>
                  <div class="col-md-3">
                    <b>TO</b>
                    <div>
                      {{ record.DATE_TO ? moment(record.DATE_TO).format('MMMM d, YYYY') : 'NO DATE FOUND' }}
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn color="primary" label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue'
import moment from 'moment'

export default defineComponent({
  name: 'ViewEmployeeModal',
  data() {
    return {
      moment: moment,
      resultEmps: {},
    }
  },
  props: ['vData', 'vServiceRecords', 'fModal'],
  methods: {
    close() {
      this.$emit('close')
    }
  }

})

</script>
<style scoped>
.n-label {
  margin-top: -12px;
}

.row-pad {
  margin-top: -6px;
}

img {
  -webkit-user-drag: none;
}
</style>