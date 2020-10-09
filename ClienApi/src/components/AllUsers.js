import React, { Component } from 'react';
import {addToken} from "../actions/index";
import {connect} from "react-redux";
import {addUsers} from "../actions/index";
import {deleteUser} from "../actions/index";
import {Redirect} from 'react-router-dom';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';

class AllUsers extends Component{
    constructor(props){
        super(props)
        this.state = {
            countPage:0,
            firstItem:0,
            lastItem:6,
            redirect:false
        }
    }
    componentDidMount() {
        if(this.props.access_token !== ''){
            fetch('https://reqres.in/api/users', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                }).then(res=>res.json())
                  .then(data => {
                   this.setState({ countPage: data.total_pages })
                   if(this.props.usersItems.length === 0){
                    for(let i = 1; i <= data.total_pages; i++){
                            fetch('https://reqres.in/api/users?page='+i, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            }).then(res=>res.json())
                            .then(data => {
                                for(let value of data.data){
                                    this.props.addUsers({usersItems:value}); 
                                }
                            });
                        }
                    }else{
                        let countItems = 0;
                        for(let value of this.props.usersItems){
                            if(value !== ""){countItems++}
                        }
                        this.setState({ countPage: Math.ceil(countItems / 6) });
                    }
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
    pagination = (n) =>{
        let lastItem = n * 6;
        this.setState({ firstItem: lastItem - 6, lastItem:lastItem })
    }
    deleteUser = (id) =>{
        this.props.deleteUser({id:id});  
    }
    render(){
        const pagination = [];
        for (let i =1; i <= Math.ceil(this.props.usersItems.length / 6); i++) {
            let numPage = this.props.usersItems.length / 6;
            if(this.props.usersItems.length > 6){
                pagination.push(<div key={i} className={i === numPage ? "pageNum paginationColor":"pageNum"} onClick={this.pagination.bind(this,i)}>{i}</div>);
            }
        }
        return(
            <div>
                {this.renderRedirect()}
                <h1>All Users</h1>
                <div className="allUsers">
                    {this.props.usersItems.slice(this.state.firstItem,this.state.lastItem).map((user) =>
                        <div className="UserIten" key={user.id}>
                            <div className="userImage">
                                <Link to={`/user_page/${user.id}`}>
                                    <img src={user.avatar} />
                                </Link> 
                            </div>
                            <div className="userData">
                                <p>First Name:  <Link to={`/user_page/${user.id}`}>{user.first_name}</Link> </p>
                                <p>Last Name: {user.last_name}</p>
                                <p>Email:{user.email}</p>
                            </div>
                            <div className="userMove">
                                <Link to={`/editpage/${user.id}`}>
                                    <div className="userMoveButton">Edit</div>
                                </Link> 
                                <div className="userMoveButton" onClick={this.deleteUser.bind(this,user.id)}>Delet user</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="pagination">
                    {pagination}
                </div>         
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
      addToken: access_token => dispatch(addToken(access_token)),
      addUsers: users => dispatch(addUsers(users)),
      deleteUser: users => dispatch(deleteUser(users)),
    };
}
const mapStateToProps = state =>{
    return {
        access_token:state.access_token,
        usersItems:state.usersItems
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);