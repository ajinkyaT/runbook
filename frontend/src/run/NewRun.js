import React, { Component } from 'react';
import { createRun } from '../util/APIUtils';
import './NewRun.css';  
import {LOCATION_MIN_LENGTH, LOCATION_MAX_LENGTH} from '../constants/index';
import { Form, Input, Button, DatePicker, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class NewRun extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            location: {
                value: ''
            },

            creationDateTime: {
                defaultValue: '01-10-2019 - 9:45'
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.currentUser = this.props.currentUser;
    }



    handleSubmit(event) {
        event.preventDefault();
        const runData = {
            title : this.state.title.value,
            location: this.state.location.value,
            creationDateTime: this.state.creationDateTime.value 
        };
        createRun(this.props.currentUser.id, runData) 

        .then(response => {
            notification.success({
                message: 'RunBook',
                description: "Thank you! You have successfully created a run event!",
            });          
            this.props.history.push("/mypage");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create run.');    
            } else {
                notification.error({
                    message: 'Running App',
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

    validateLocation = (locationText) => {
        if(locationText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your location!'
            }
        } else if (locationText.length > LOCATION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Location is too long (Maximum ${LOCATION_MAX_LENGTH} characters allowed)`
            }    
        } else if (locationText.length < LOCATION_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Location is too short (Minimum ${LOCATION_MIN_LENGTH} characters needed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleDateChange = (value, time) => {
        this.setState(
            {
                creationDateTime: {
                value: time,
                }
            }
        );
      };

    handleTitleChange(event,validationFun) {
        const value = event.target.value;
        this.setState({
            title: {
                value: value,
                ...validationFun(value)
            }
        });
    }

    handleLocationChange(event,validationFun) {
        const value = event.target.value;
        this.setState({
            location: {
                value: value,
                ...validationFun(value)
            }
        });
    }



    isFormInvalid() {
        if(this.state.title.validateStatus !== 'success' && this.state.location.validateStatus !== 'success') {
            return true;
        }
    }

    render() {

        return (
            <div className="new-run-container">
                <h1 className="page-title">Create Run</h1>
                <div className="new-run-content">
                    <Form onSubmit={this.handleSubmit} className="create-run-form">
                        <FormItem validateStatus={this.state.title.validateStatus}
                            help={this.state.title.errorMsg} className="run-form-row">
                        <TextArea 
                            placeholder="Enter your title"
                            style = {{ fontSize: '22px' }} 
                            name = "title"
                            autoComplete="off"
                            value = {this.state.title.value}
                            onChange = {(event) => this.handleTitleChange(event, this.validateTitle)} />
                        </FormItem>
                        <FormItem validateStatus={this.state.location.validateStatus}
                            help={this.state.location.errorMsg} className="run-form-row">
                        <TextArea 
                            placeholder="Enter your location"
                            style = {{ fontSize: '16px' }} 
                            name = "location"
                            autoComplete="off"
                            value = {this.state.location.value}
                            onChange = {(event) => this.handleLocationChange(event, this.validateLocation)} />
                        </FormItem>

                        <FormItem className="run-form-row">
                            <DatePicker
                                    showTime
                                    format="DD-MM-YYYY - HH:mm"
                                    onChange={this.handleDateChange}
                                    />
                        </FormItem>
                        <FormItem className="run-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-run-form-button">Create Run</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}



export default NewRun;