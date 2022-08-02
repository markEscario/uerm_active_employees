import axios from "axios";

export async function getActiveEmployees(context) {
  try {
    const response = await axios.get('http://localhost:8080/api/employees')
    context.commit('setEmployees', response.data)
    return response
  } catch (err) {
    console.log(err);
    context.commit('setPageStatus', err)
  }
}
export async function getSearchedEmployees(context, payload) {
  try {
    const response = await axios.post('http://localhost:8080/api/search_employees', payload)
    context.commit('setSearchedEmployees', response.data)
    context.commit('setResultForStateFilter', response.data)
    return response
  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getSearchedEmployeeDetails(context, payload) {
  try {
    const response = await axios.post('http://localhost:8080/api/search_employee_details', payload)
    context.commit('setEmployeeDetails', response.data)
    return response
  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getEmployeeProfile(context, payload) {
  console.log('employee by id: ', payload)
  try {
    const response = await axios.get(`http://localhost:8080/api/employee/${payload}`)
    console.log('employee profile: ', response.data)
    context.commit('setEmployeeProfile', response.data)
    return response.data[0]
  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getDepartment(context, payload) {
  try {
    const response = await axios.get('http://localhost:8080/api/get_department')
    const getDept = response.data.map(element => element.description);
    context.commit('setDepartment', getDept)
    return response

  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getPositions(context, payload) {
  try {
    const response = await axios.get('http://localhost:8080/api/get_positions')
    const getPosition = response.data.map(element => element.Position);
    context.commit('setPositions', getPosition)
    return response

  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getEmployeeStatus(context, payload) {
  try {
    const response = await axios.get('http://localhost:8080/api/get_employee_status')
    const getStatus = response.data.map(element => element.DESCRIPTION);
    context.commit('setEmployeeStatus', getStatus)
    return response

  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}
export async function getEmployeeClass(context, payload) {
  try {
    const response = await axios.get('http://localhost:8080/api/get_employee_class')
    const getClass = response.data.map(element => element.DESCRIPTION.trim());
    console.log('pos class: ', getClass)
    context.commit('setEmployeeClass', getClass)
    return response

  } catch (err) {
    console.log(err);
    context.commit('setSearchStatus', err)
  }
}