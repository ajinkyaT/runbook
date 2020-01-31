import React, { Component } from 'react';
import { createPost } from '../util/APIUtils';
import './NewPost.css';  
import { Form, Input, Button, DatePicker, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            content: {
                value: ''
            },

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.currentUser = this.props.currentUser;
    }



    handleSubmit(event) {
        event.preventDefault();
        const postData = {
            title : this.state.title.value,
            content: this.state.content.value,
        };
        createPost(this.props.currentUser.id, postData) 

        .then(response => {
            notification.success({
                message: 'RunBook',
                description: "Thank you! You have successfully created a post event!",
            });          
            this.props.history.push("/mypage");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create post.');    
            } else {
                notification.error({
                    message: 'RunBook',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateTitle = (titleText) => {
        if(titleText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your title!'
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateContent = (contentText) => {
        if(contentText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your content!'
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleTitleChange(event,validationFun) {
        const value = event.target.value;
        this.setState({
            title: {
                value: value,
                ...validationFun(value)
            }
        });
    }

    handleContentChange(event,validationFun) {
        const value = event.target.value;
        this.setState({
            content: {
                value: value,
                ...validationFun(value)
            }
        });
    }



    isFormInvalid() {
        if(this.state.title.validateStatus !== 'success' && this.state.content.validateStatus !== 'success') {
            return true;
        }
    }

    render() {

        return (
            <div className="new-post-container">
                <h1 className="page-title">Create Post</h1>
                <div className="new-post-content">
                    <Form onSubmit={this.handleSubmit} className="create-post-form">
                        <FormItem validateStatus={this.state.title.validateStatus}
                            help={this.state.title.errorMsg} className="post-form-row">
                        <TextArea 
                            placeholder="Enter your title"
                            style = {{ fontSize: '22px' }} 
                            name = "title"
                            autoComplete="off"
                            value = {this.state.title.value}
                            onChange = {(event) => this.handleTitleChange(event, this.validateTitle)} />
                        </FormItem>
                        <FormItem validateStatus={this.state.content.validateStatus}
                            help={this.state.content.errorMsg} className="post-form-row">
                                
                        <TextArea 
                            placeholder="Enter your content"
                            style = {{ fontSize: '16px' }} 
                            name = "content"
                            autoComplete="off"
                            value = {this.state.content.value}
                            onChange = {(event) => this.handleContentChange(event, this.validateContent)} />
                        </FormItem>

                        <FormItem className="post-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-post-form-button">Create Post</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}



export default NewPost;