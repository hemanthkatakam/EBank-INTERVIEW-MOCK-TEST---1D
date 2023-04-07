import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {errorMsg: '', userID: '', userPIN: ''}

  onChangeUserID = event => {
    this.setState({userID: event.target.value})
  }

  onChangePIN = event => {
    this.setState({userPIN: event.target.value})
  }

  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userID, userPIN} = this.state
    const userDetails = {user_id: userID, pin: userPIN}
    const loginApiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg, userID, userPIN} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="sub-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            <div>
              <label htmlFor="user id" className="label-heading">
                User ID
              </label>
              <br />
              <input
                type="text"
                placeholder="Enter User ID"
                id="user id"
                className="input-field"
                onChange={this.onChangeUserID}
                value={userID}
              />
            </div>
            <div>
              <label htmlFor="pin" className="label-heading">
                PIN
              </label>
              <br />
              <input
                type="password"
                placeholder="Enter PIN"
                id="pin"
                className="input-field"
                onChange={this.onChangePIN}
                value={userPIN}
              />
            </div>
            <button type="submit" className="login">
              Login
            </button>
            {errorMsg.length === 0 ? null : <p className="error">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
