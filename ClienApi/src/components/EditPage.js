import React, { Component } from 'react';
import {connect} from "react-redux";
import {addUsers} from "../actions/index";
import {changeUser} from "../actions/index";
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';


class EditPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            avatar:'',
            email:'',
            first_name:"",
            last_name:"",
            updateFinish:false
        }
        this.handleChange = this.handleChange.bind(this);
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
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    updateUserInfo = () => {
        const itemUser = this.props.usersItems;
        const item = itemUser.find(item => item.id === parseInt(this.props.match.params.userid));
        const itemIndex = itemUser.indexOf(item);
        itemUser[itemIndex]['avatar'] = this.state.avatar;
        itemUser[itemIndex]['email'] = this.state.email;
        itemUser[itemIndex]['first_name'] = this.state.first_name;
        itemUser[itemIndex]['last_name'] = this.state.last_name;
        this.props.changeUser({id:parseInt(this.props.match.params.userid)});  
        this.setState({updateFinish:true});
    }
    updateFinish = () => {
        if (this.state.updateFinish === true) {
            return <div>You update user information</div>;
        }
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
                <h1>Edit User</h1>
                {this.state.updateFinish? <div>You update user information</div>:""}
                <div className="LogInForm">
                    <form>
                        <p>Avatart:</p>
                        <input className="emailInput" type="text" name="avatar" value={this.state.avatar} onChange={this.handleChange} />
                        <p>Email:</p>
                        <input className="passwordInput"  type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                        <p>First Name:</p>
                        <input className="passwordInput"  type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange} />
                        <p>Last Name:</p>
                        <input className="passwordInput"  type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange} />
                        <div>
                            <input className="logInButton"  onClick={this.updateUserInfo} type="button" value="Log in" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        changeUser: users => dispatch(changeUser(users))
    };
}
const mapStateToProps = state =>{
    return {
        usersItems:state.usersItems,
        access_token:state.access_token,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
