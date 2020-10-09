import React, { Component } from 'react';
import {connect} from "react-redux";
import {addUsers} from "../actions/index";
import {changeUser} from "../actions/index";
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';


class UserPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            avatar:'',
            email:'',
            first_name:"",
            last_name:"",
            updateFinish:false
        }
    }
    componentDidMount(){
        const itemUser = this.props.usersItems;
        const item = itemUser.find(item => item.id === parseInt(this.props.match.params.userid));
        this.setState({
            avatar:item.avatar,
            email: item.email,
            first_name:item.first_name,
            last_name:item.last_name,
        }); 
    }
    renderRedirect = () => {
        if(this.props.access_token === ''){
            return <Redirect to='/'/>
        }
    }
    render(){
        return(
            <div>
                {this.renderRedirect()}
                <h1>User page</h1>
                <div className="LogInForm">
                    {/* <p><img src={this.state.avatar}/></p> */}
                    <p>Email: {this.state.email}</p>
                    <p>First Name: {this.state.first_name}</p>
                    <p>Last Name: {this.state.last_name}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        usersItems:state.usersItems,
        access_token:state.access_token,
    };
};
export default connect(mapStateToProps)(UserPage);
