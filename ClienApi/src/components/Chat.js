import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from "react-redux";

class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            messages:[]
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    componentDidMount() {
        if(this.props.access_token !== ''){
            fetch('http://localhost:8000/all_chat_messages', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                }).then(res=>res.json())
                  .then(data => {
                   this.setState({ messages: data })
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
    sendMessage = () => {
        fetch('http://localhost:8000/new_message',{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.props.access_token.user_name,
                message:this.state.message,
                date: new Date().getDate()+"-"+new Date().getMonth()+"-"+new Date().getFullYear()
            })
        }).then(res=>res.json())
        .then(res => {
            this.setState({
                message:'',
                messages: [...this.state.messages, {
                    name: this.props.access_token.user_name,
                    message:this.state.message,
                    date: new Date().getDate()+"-"+new Date().getMonth()+"-"+new Date().getFullYear()
                }],
            })
        }); 
    }
    render(){
        return(
            <div>
                {this.renderRedirect()}
                <h1>Chat</h1>
                <div className="chatBlock">
                    {this.state.messages.slice(this.state.messages.length-6,this.state.messages.length).map((item) =>
                        <div  className={item.name === this.props.access_token.user_name? "myMessage":"notMyMessage" } key={item.id+item.name}>
                           <div className="message">
                                <p>Name: {item.name}, date: {item.date}</p>
                                <p>{item.message}</p>
                           </div> 
                        </div>
                    )}
                </div>
                <div className="Chat_form">
                    <input className="messageText" type="text"  name="message" value={this.state.message || ""} onChange={this.handleChange} />
                    <input className="logInButton"  onClick={this.sendMessage} type="button" value="ok" />
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
export default connect(mapStateToProps)(Chat);