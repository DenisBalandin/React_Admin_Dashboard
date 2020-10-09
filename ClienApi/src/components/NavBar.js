import React, { Component } from 'react';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import {addToken} from "../actions/index";
import {connect} from "react-redux";

class NavBar extends Component{
    constructor(props){
        super(props)
    }
    logOut = () =>{
        this.props.addToken({access_token:""}); 
    }
    render(){
        return(
            <div id="NavBar">
                {this.props.access_token === "" ? 
                    <div className="menuhome">
                        <Link to="/">
                            <div>Home</div>
                        </Link>
                    </div> : <div className="menuhome">
                        <Link to="/allusers">
                            <div>Users</div>
                        </Link>
                        <Link to="/newuser">
                            <div>New User</div>
                        </Link>
                        <Link to="/chat">
                            <div>Chat</div>
                        </Link>
                        <Link to="/admin_access_users">
                            <div>Admin access users</div>
                        </Link>
                        <Link to="/video_chat">
                            <div>Video Chat</div>
                        </Link>
                    </div>
                }
                {this.props.access_token === "" ? 
                    <div className="barmenu">
                        <Link to="/login">
                            <div>Log In</div>
                        </Link>
                        <Link to="/signup">
                            <div>Sign up</div>
                        </Link>  
                    </div> : <div className="barmenu">
                        <div>Welcome {this.props.access_token.user_name}</div>
                        <Link onClick={this.logOut} to="/">
                            <div>Log out</div>
                        </Link>
                    </div>
                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
      addToken: access_token => dispatch(addToken(access_token)),
    };
}
const mapStateToProps = state =>{
    return {
        access_token:state.access_token,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);