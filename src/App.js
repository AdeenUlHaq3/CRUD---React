import React, { Component } from 'react';
import './App.css';
import swal from 'sweetalert';

class App extends Component {
  constructor() {
    super();
    this.state = {
      employees: [],
      user: false,
      form: false,
      isEdit: false,
      empFirstName: '',
      empLastName: '',
      empEmail: '',
      empNumber: '',
      empDate: ''
    }
    this.renderLogin = this.renderLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterList = this.filterList.bind(this);
    this.allowUser = this.allowUser.bind(this);
    this.showTable = this.showTable.bind(this);
    this.addEmployeeForm = this.addEmployeeForm.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
  }
  addEmployee() {
    const { empFirstName, empLastName, empEmail, empNumber, empDate, employees } = this.state;  
    employees.push({empFirstName, empLastName, empEmail, empNumber, empDate});
    this.setState({ form: false, searchText: '', employees, empFirstName: '', empLastName: '', empEmail: '', empNumber: '', empDate: '' });
    swal("Successfully Added", "Your record has been added", "success");
  }
  editEmployee() {
    const { empFirstName, empLastName, empEmail, empNumber, empDate, employees } = this.state;
    employees.splice(this.state.currentEditIndex, 1, {empFirstName, empLastName, empEmail, empNumber, empDate});
    this.setState({
      isEdit: false,
      form: false,
      searchText: '', 
      employees,
      empFirstName: '',
      empLastName: '',
      empEmail: '',
      empNumber: '',
      empDate: ''
    })
    swal("Successfully Updated", "Your record has been updated", "success");
  }
  deleteEmployee(index) {
    const { employees } = this.state;
    swal({
      title: "Are you sure you you want to delete?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        employees.splice(index, 1);
        this.setState({
          employees
        })
        swal("Poof! Your record has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your record is safe!");
      }
    });
    
  }
  allowEditForm(index) {
    const { employees } = this.state;
    this.setState({
      isEdit: true,
      form: true,
      currentEditIndex: index,
      empFirstName: employees[index].empFirstName,
      empLastName: employees[index].empLastName,
      empEmail: employees[index].empEmail,
      empNumber: employees[index].empNumber,
      empDate: employees[index].empDate
    })
  }
  allowUser() {
    if(this.state.email === 'a' && this.state.password === 'a') {
      this.setState({
        user: true
      })
      swal("Hi Admin", "Welcome to the admin Panel", "success");
    }
    else
      swal("Sorry", "Wrong Email or Password", "warning");
    return false;
  }
  handleChange(e) {
    this.setState({
       [e.target.name]: e.target.value
    })
    console.log(new Date().toISOString().substr(0,10))
  }
  filterList(e) {
    const { employees } = this.state;
    const text = e.target.value;
    var result = employees.filter(employee => employee.empFirstName.startsWith(text))
    
    this.setState({
      [e.target.name]: e.target.value,
      result,
      text
   })
  }
  renderLogin() {
    return <div>
            <h1>Log In</h1>
            <form>
              <input className='form-control' placeholder='Email' name='email' onChange={this.handleChange} id='email' required type='email'/>
              <input className='form-control' placeholder='Password' name='password' onChange={this.handleChange} required id='password' type='password'/>
              <input type='submit' onClick={this.allowUser} value='Log In'/>
            </form>
          </div>
  }
  showTable(){
    const { employees, result, searchText } = this.state;
    const items = searchText ? result : employees;
    return  <div>
              <input className='logout' type='button' value='Logout' onClick={() => this.setState({ user: false })}/>
              <input type='text' name='searchText' className='search' onChange={this.filterList} placeholder='First Name Search....'/>
              <h1>Employee Table</h1> 
              <input type='button' className='float-button' value='+' onClick={() => this.setState({form: true, isEdit: false })}/>
              <center>
                <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Joining Date</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                {
                  items.map((employee, index) => {
                    return  <tr>
                              <td>{employee.empFirstName}</td>
                              <td>{employee.empLastName}</td>
                              <td>{employee.empEmail}</td>
                              <td>{employee.empNumber}</td>
                              <td>{employee.empDate}</td>
                              <td><input className='btn-edit' type='button' onClick={this.allowEditForm.bind(this, index)} value='Edit'/></td>
                              <td><input className='btn-delete' type='button' onClick={this.deleteEmployee.bind(this, index)} value='Delete'/></td>
                            </tr>
                  })
                }
                </tbody>
                </table>
              </center>
            </div>
  }
  addEmployeeForm() {
    return  <div>
              {!this.state.isEdit ? <h1>Add Employee</h1> : <h1>Edit Employee</h1>}
              <form>
                <input name='empFirstName' className='form-control' onChange={this.handleChange} value={this.state.empFirstName} type='text' required placeholder='First Name'/>
                <input name='empLastName' className='form-control' onChange={this.handleChange} value={this.state.empLastName} type='text' required placeholder='Last Name'/>
                <input name='empEmail' className='form-control' onChange={this.handleChange} value={this.state.empEmail} type='email' required placeholder='Email'/>
                <input name='empNumber' className='form-control' onChange={this.handleChange} value={this.state.empNumber} type='number'required placeholder='Salary'/>
                <input name='empDate' className='form-control' onChange={this.handleChange} value={this.state.empDate} required type='date'/>
                {!this.state.isEdit ? <input type='submit' onClick={this.addEmployee} value='Add'/> : <input type='button' onClick={this.editEmployee} value='Edit'/>}
                <input type='button' onClick={() => this.setState({ form: false })} value='Cancel'/>
              </form>
            </div>
  }  
  render() {
    const { user, form } = this.state;
    return (
      <div className="App">
        {!user && this.renderLogin()}
        {user && !form && this.showTable()}
        {user && form && this.addEmployeeForm()}
      </div>
    );
  }
}

export default App;
