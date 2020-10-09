import React, { Component } from 'react';
import {connect} from "react-redux";
import {Redirect} from 'react-router-dom';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';


class AdminAccessUsers extends Component{
    constructor(props){
        super(props)
        this.state = {
          users:[]
        }
    }
    componentDidMount() {
        if(this.props.access_token !== ''){
            fetch('http://localhost:8000/acces_users', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                }).then(res=>res.json())
                  .then(data => {
                    this.setState({ users: data.users })
                });
        }else{
            this.setState({
                redirect:true
            });
        }
    }
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    }
    render(){
        return(
            <div>
                {this.renderRedirect()}
                <h1>Admin access users</h1>
                <div className="allUsers">
                    {this.state.users.map((user) =>
                        <div className="UserIten" key={user.id}>
                            <div className="userDataAccess">
                                <p>Full Name: {user.fullname}</p>
                                <p>Email: {user.email}</p>
                                <p>Password: {user.password}</p>
                            </div>
                        
                        </div>
                    )}
                </div>       
            </div>
        )
    }
}
const mapStateToProps = state =>{
    return {
        access_token:state.access_token,
    };
};
export default connect(mapStateToProps)(AdminAccessUsers);