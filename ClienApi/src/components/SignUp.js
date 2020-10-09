import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import {addToken} from "../actions/index";

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '', 
            password: '',
            redirect: false,
            registerFail:false
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/allusers'/>
        }
    }
    login = () =>{
        fetch('http://localhost:8000/auth/register',{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password:this.state.password,
                fullname:this.state.fullname
            })
        }).then(res=>res.json())
        .then(res => {
            
            if(res.access_token !== undefined){
                this.props.addToken({access_token:{access_tokenuser:res.access_token,user_name:this.state.fullname}}); 
                this.setState({
                    redirect: true
                });
            }else{
                this.setState({
                    registerFail: true
                });
            }
        }); 
    }
    render(){
        return(
            <div>
                {this.renderRedirect()}
                <h1>Join today.</h1>
                {this.state.registerFail? <div>This Login arleady exist</div>:""}
                <div className="LogInForm">
                    <form>
                        <p>Full Name:</p>
                        <input className="emailInput" type="text" name="fullname" value={this.state.fullname || ""} onChange={this.handleChange} />
                        <p>Email:</p>
                        <input className="emailInput" type="text" name="email" value={this.state.email || ""} onChange={this.handleChange} />
                        <p>Password:</p>
                        <input className="passwordInput"  type="password" name="password" value={this.state.password || ""} onChange={this.handleChange} />
                        <div>
                            <input className="logInButton"  onClick={this.login} type="button" value="Sign up" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

// export default App;
function mapDispatchToProps(dispatch) {
    return {
      addToken: access_token => dispatch(addToken(access_token)),
    };
  }
const mapStateToProps = state =>{
    return {
        access_token:state.access_token
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);