import React, { Component } from 'react';
import { getUserCreatedPosts, deletePost } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification, List } from 'antd';
import { withRouter } from 'react-router-dom';
import './PostList.css';

class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isLoading: false
        };
        this.loadPostList = this.loadPostList.bind(this);
        this.handleDelete = this.handleDelete.bind(this)
    }

    loadPostList() {
        let promise;
        promise = getUserCreatedPosts(this.props.currentUser.id);
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({
                posts: response,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    handleDelete(event, itemId) {        
        event.preventDefault();
        deletePost(this.props.currentUser.id, itemId);
        this.setState({
            posts : this.state.posts.filter(item => item.id !== itemId)
        });
        notification.success({
            message: 'RunBook',
            description: "Thank you! You have successfully deleted a post!",
        });
      }


    componentDidMount() {
        this.loadPostList();
    }


    render() {
        return (
            <div className="posts-container">
                {
                    !this.state.isLoading && this.state.posts.length === 0 ? (
                        <div className="no-posts-found">
                            <span>No Posts Found.</span>
                        </div>    
                    ): null
                }  
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
                <div className="posts-list-scroll">
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                    pageSize: 5,
                    }}
                    dataSource={this.state.posts}
                    renderItem={item => (
                    <List.Item
                        key={item.id}
                        actions={[
                        <Icon type="delete" key="list-vertical-delete" onClick = {(event) => this.handleDelete(event,item.id)}/>,
                        ] } >
                        <List.Item.Meta
                        title={item.title}
                        />
                        {item.content}
                    </List.Item>
                    )}
                />
                
                
                </div>
            </div>
        );
    }
}

export default withRouter(PostList);