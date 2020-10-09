import React, { Component } from 'react';
import {connect} from "react-redux";
import {addUsers} from "../actions/index";
import {Redirect} from 'react-router-dom';

class NewUser extends Component{
    constructor(props){
        super(props)
        this.state = {
            newUser:false,
        }
        this.handleChange = this.handleChange.bind(this);

    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    addNewUser = () => {
        console.log(this.state);
        fetch('https://reqres.in/api/users', {
        method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: this.state.name,
                job: this.state.job,
            })
        }).then(res=>res.json())
        .then(res => {
            this.props.addUsers({usersItems:{id:parseInt(res.id), first_name:this.state.name,last_name:"",avatar:"",email:"" }}); 
            this.setState({name:"",job:"",newUser:true});
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
                <h1>Create new user</h1>
                {this.state.newUser ? <div>You create new user</div>: ""}
                <form>
                    <p>Name:</p>
                    <input className="emailInput"  name="name" value={this.state.name || ""} onChange={this.handleChange} />
                    <p>Job:</p>
                    <input className="passwordInput"   name="job" value={this.state.job || ""} onChange={this.handleChange} />
                    <div>
                        <input className="logInButton"  onClick={this.addNewUser} type="button" value="Log in" />
                    </div>
                </form>
            </div>
        )
    }
}
// export default App;
function mapDispatchToProps(dispatch) {
    return {
      addUsers: users => dispatch(addUsers(users))
    };
}
const mapStateToProps = state =>{
    return {
        access_token:state.access_token,
        usersItems:state.usersItems
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewUser);