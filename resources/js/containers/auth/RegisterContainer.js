import React, { Component } from 'react';
import { Register } from '../../components/auth'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/modules/authentication';
import { getCookie } from '../../lib/cookie'
import produce from 'immer';

class RegisterContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    getCookie('user') && getCookie('user').isLoggedIn && this.props.history.push('/')
  }

  handleChange(e) {
    this.setState(produce(this.state, draft => {
      draft[e.target.name] = e.target.value
    }))
  }

  handleSubmit() {
    this.props.AuthActions.registerRequest(this.state)
    .then(() => {
      alert("인증 메일을 발송하였습니다.")
      this.props.history.push('/login')
    })
  }

  render() {
    return(
      <Register
        state={this.state}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.authentication.register.status
})

const mapDispatchToProps = (dispatch) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);