import React, { Component } from 'react';
import { editProfile } from '../../util/APIUtils';
import './EditProfile.css';  
import {loadCurrentUser} from '../../app/App'
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    LOCATION_MIN_LENGTH, LOCATION_MAX_LENGTH,
    AGE_MAX ,AGE_MIN
} from '../../constants';
import { Form, Input, Button, notification,InputNumber } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            location: {
                value: ''
            },
            age: {
                value: null
            },
            email: {
                value: ''
            },

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const editData = {
            name: this.state.name.value,
            age: this.state.age.value,
            location: this.state.location.value,
            email: this.props.currentUser.email,
            password: 'dummyValue'
        };
        editProfile(this.props.currentUser.id, editData) 

        .then(response => {
            notification.success({
                message: 'EditBook',
                description: "Thank you! You have successfully edited profile",
            });          
            this.props.history.push("/mypage");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create edit.');    
            } else {
                notification.error({
                    message: 'EditBook App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.location.validateStatus === 'success' 
        );
    }

    componentDidMount(){
        console.log(this.props)
    }
    
    render() {

        return (
            <div className="new-edit-container">
                <h1 className="page-title"> Edit Profile</h1>
                <div className="new-edit-content">
                    <Form onSubmit={this.handleSubmit} className="create-edit-form">
                    <FormItem 
                            label="Full Name"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input 
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder={this.props.currentUser.name}
                                value={this.state.name.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem label="Location"
                            validateStatus={this.state.location.validateStatus}
                            help={this.state.location.errorMsg}>
                            <Input 
                                size="large"
                                name="location" 
                                autoComplete="off"
                                placeholder={this.props.currentUser.location}
                                value={this.state.location.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateLocation)} />    
                        </FormItem>
                        <FormItem label="Age"
                            validateStatus={this.state.age.validateStatus}
                            help={this.state.age.errorMsg}>
                            <InputNumber 
                                size="large"
                                name="age" 
                                type="number" 
                                autoComplete="off"
                                placeholder={this.props.currentUser.age}
                                value={this.state.age.value} 
                                onChange={this.handleAgeChange} />    
                        </FormItem>
                        <FormItem 
                            label="Email"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}>
                            <Input 
                                size="large"
                                name="email" 
                                type="email" 
                                autoComplete="off"
                                placeholder={this.props.currentUser.email}
                                disabled = {true}
                                />    
                        </FormItem>
                        <FormItem className="edit-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-edit-form-button">Create Edit</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }

    // Validation Functions

validateName = (name) => {
    if(name.length < NAME_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
        }
    } else if (name.length > NAME_MAX_LENGTH) {
        return {
            validationStatus: 'error',
            errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
          };            
    }
}


validateLocation = (location) => {
    if(location.length < LOCATION_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `location is too short (Minimum ${LOCATION_MIN_LENGTH} characters needed.)`
        }
    } else if (location.length > LOCATION_MAX_LENGTH) {
        return {
            validationStatus: 'error',
            errorMsg: `Location is too long (Maximum ${LOCATION_MAX_LENGTH} characters allowed.)`
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }
}

handleAgeChange(inputValue) {
    const inputName = 'age';       
    this.setState({
        [inputName] : {
            value: inputValue,
            ...this.validateAge(inputValue)
        }
    });
}

validateAge = (age) => {
    if(age < AGE_MIN) {
        return {
            validateStatus: 'error',
            errorMsg: `Age is too short (Minimum ${AGE_MIN}  needed.)`
        }
    } else if (age > AGE_MAX) {
        return {
            validationStatus: 'error',
            errorMsg: `Age is too much (Maximum ${AGE_MAX} allowed.)`
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }
}

}




export default EditProfile;