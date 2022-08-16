import axios from "axios";

export async function getSearchedEmployees(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employees?searchData=${payload.filterData}`)
    let activeEmployees = response.data.filter(activeEmployee => activeEmployee.IS_ACTIVE)
    context.commit('setSearchedEmployees', activeEmployees)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getSearchedEmployeeDetails(context, payload) {
  try {
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employees`, payload)
    context.commit('setEmployeeDetails', response.data)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getDepartment(context, payload) {
  try {
    const response = await axios.post(`${this.state.activeEmployees.apiUrl}/get_department`)
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
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/get_positions`)
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
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employeesget_employee_status`)
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
    const response = await axios.get(`${this.state.activeEmployees.apiUrl}/search_employeesget_employee_class`)
    const getClass = response.data.map(element => element.DESCRIPTION.trim());
    getClass.unshift('')
    context.commit('setEmployeeClass', getClass)
    return response

  } catch (err) {
    console.log(err);
    return err
  }
}