import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import AllUsers from './AllUsers';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Home from './Home';
import NewUser from './NewUser';
import EditPage from './EditPage';
import Chat from './Chat';
import AdminAccessUsers from './AdminAccessUsers';
import UserPage from './UserPage';
import VideoChatApp from './VideoChat';

class Body extends Component{
    render(){
        return(
            <div>
                <Route exact path="/allusers"  component={AllUsers}/>
                <Route exact path="/login"  component={LogIn}/>
                <Route exact path="/signup"  component={SignUp}/>
                <Route exact path="/newuser"  component={NewUser}/>
                <Route exact path="/"  component={Home}/>
                <Route exact path="/editpage/:userid" component={EditPage} />
                <Route exact path="/chat" component={Chat} />
                <Route exact path="/admin_access_users" component={AdminAccessUsers} />
                <Route exact path="/user_page/:userid" component={UserPage} />
                <Route exact path="/video_chat" component={VideoChatApp} />
                <Route exact path="/video_chat/:userid" component={VideoChatApp} />
            </div>
        );
    }
}
export default Body;