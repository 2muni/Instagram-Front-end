import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { produce } from 'immer';
import socketIOClient from "socket.io-client";
import axios from 'axios'

import { createCookie, getCookie } from '../../lib/cookie'
import { Header } from '../../components/base/Header'
import * as authActions from '../../store/modules/authentication';


class HeaderContainer extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      currentMenu:'',
      notifications:[],
      message:[],
      people:[],
    }
    
    this.connectSocketChannel = this.connectSocketChannel.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
  }
  
  connectSocketChannel(channel) {
    const socket = socketIOClient('/', {
      secure: true,
      rejectUnauthorized: false,
      path: '/socket/socket.io'
    });

    socket.on(`${channel}:App\\Events\\NotificationSent`, data => {
      if(this.state.notifications.length === 0)
        this.setState(produce(this.state, draft => {
          draft.notifications.unshift(data.data)
        }))
      else(this.state.notifications[this.state.notifications.length - 1].id !== data.data.id)
        this.setState(produce(this.state, draft => {
          draft.notifications.unshift(data.data)
        }))
    })
  }
  
  componentDidMount() {
    window.onclick = this.handleMenu;
    let loginData = getCookie('user');
    if(typeof loginData === "undefined") return this.props.history.push('/login');
    else if(!loginData.isLoggedIn) return this.props.history.push('/login');
    
    this.props.AuthActions.userRequest()
      .then(() => { !this.props.status.valid && this.props.history.push('/login') })
      .then(() => { this.connectSocketChannel(this.props.status.currentUser.id) })
      .then(() => {
        axios.get(`/api/channels/${this.props.status.currentUser.id}/notifications?page=1`)
          .then(() => {
            axios.get(`/api/channels/${this.props.status.currentUser.id}/notifications?page=1`)
              .then(res => this.setState(produce(this.state, draft => {
                console.log(res.data.data)
                draft.notifications = res.data.data;
              })))
          })
      })
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.status.currentUser !== this.props.status.currentUser || 
           nextProps.location.pathname !== this.props.location.pathname ||
           nextState.currentMenu !== this.state.currentMenu ||
           nextState.notifications !== this.state.notifications ||
           nextState.currentMenu !== this.state.currentMenu
  }

  componentDidUpdate(nextProps, nextState) {
    if(nextProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname !== '/register' &&
      this.props.location.pathname !== '/login'
    ){
      this.props.AuthActions.userRequest()
        .then(() => { !this.props.status.valid && this.props.history.push('/login') })
        .then(() => { this.connectSocketChannel(this.props.status.currentUser.id) })
        .then(() => {
          axios.get(`/api/channels/${this.props.status.currentUser.id}/notifications?page=1`)
            .then(res => this.setState(produce(this.state, draft => {
              console.log(res.data.data)
              draft.notifications = res.data.data;
            })))
        })
    }
  }

  handleLogout() {
    this.props.AuthActions.logoutRequest()
    createCookie('user', {
      isLoggedIn: false,
      currentUser: ''
    })
  }
  
  handleMenu(e) {
    if(e.target.matches('.dropbtn')) {
      const menu = e.target.innerText
      axios.post(`/api/channels/${this.props.status.currentUser.id}/notifications`, menu)
      .then(() => this.setState({ currentMenu: menu }))
    }else {
      this.setState({ currentMenu: '' })
    }
    
  }

  render() {
    const path = /(login|register|write)/;
    const isHidden = path.test(this.props.location.pathname);
    return (
      isHidden ? <Fragment></Fragment> : 
      <Header
        currentMenu={this.state.currentMenu}
        handleLogout={this.handleLogout}
        handleMenu={this.handleMenu}
        notifications={this.state.notifications}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.authentication.status
})

const mapDispatchToProps = (dispatch) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
