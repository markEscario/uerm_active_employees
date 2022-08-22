import axios from "axios";
import { date } from 'quasar'


export async function getSearchedEmployees(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employees?searchData=${payload.filterData}`)
    response.data = response.data.filter(activeEmployee => activeEmployee.IS_ACTIVE)
    for (const item of response.data) {
      const dateToday = new Date().toISOString().slice(0, 10);
      const unit = 'years'
      item['SERVICE YEARS'] = date.getDateDiff(dateToday, item.HIRED, unit)
    }
    context.commit('setSearchedEmployees', response.data)

    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getSearchedEmployeeDetails(context, payload) {
  try {
    let getString = `campus=${payload.campus}&gender=${payload.gender}&department=${payload.department}&position=${payload.position}`;
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employee_details?${getString}`)
    context.commit('setEmployeeDetails', response.data)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getDepartment(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/department`)
    const getDept = response.data.map(element => element.description);
    getDept.unshift('')
    context.commit('setDepartment', getDept)
    return response

  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getPositions(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/positions`)
    const getPosition = response.data.map(element => element.Position);
    getPosition.unshift('')
    context.commit('setPositions', getPosition)
    return response

  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getEmployeeStatus(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/employee_status`)
    const getStatus = response.data.map(element => element.DESCRIPTION);
    getStatus.unshift('')
    context.commit('setEmployeeStatus', getStatus)
    return response

  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getEmployeeClass(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/employee_class`)
    const getClass = response.data.map(element => element.DESCRIPTION.trim());
    getClass.unshift('')
    context.commit('setEmployeeClass', getClass)
    return response

  } catch (err) {
    console.log(err);
    return err
  }
}