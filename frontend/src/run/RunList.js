import React, { Component } from 'react';
import { getAllRuns, getUserCreatedRuns, deleteRun, joinRun } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification, List} from 'antd';
import { withRouter,  Redirect} from 'react-router-dom';
import './RunList.css';

class RunList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runs: [],
            filtered: [],
            isLoading: false,
        };
        this.loadRunList = this.loadRunList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleJoin = this.handleJoin.bind(this)
    }

    loadRunList() {
        let promise;
        if(typeof this.props.currentUser != "undefined" && this.props.type != "ALL_RUNS") {
                promise = getUserCreatedRuns(this.props.currentUser.id);
        } else {
            promise = getAllRuns();
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            this.setState({
                runs: response,
                filtered:response,
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
        deleteRun(itemId);
        this.setState({
            filtered : this.state.runs.filter(item => item.id !== itemId)
        });
        notification.success({
            message: 'RunBook',
            description: "Thank you! You have successfully deleted a run event!",
        });
      }

    componentDidMount() {
        this.loadRunList();
        this.setState({
            filtered: this.state.runs
          });
    }

    handleJoin(event, item){
        if (typeof this.props.currentUser != "undefined"){
            event.preventDefault();
            joinRun(this.props.currentUser.id, item.id, item)
            notification.success({
                message: 'RunBook',
                description: "Thank you! You have successfully joined a run event!",
            });
        } else { return <Redirect
            to={{
              pathname: '/login',
              state: { from: this.props.location }
            }}/>}
    }




    handleChange(e) {        
        // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (e.target.value !== "") {
                // Assign the original list to currentList
        currentList = this.state.runs;

                // Use .filter() to determine which items should be displayed
                // based on the search terms
        newList = currentList.filter(item => {
                    // change current item to lowercase
            const lc = item.location.toLowerCase();
                    // change search term to lowercase
            
            const filter = e.target.value.toLowerCase();
                    // check to see if the current list item includes the search term
                    // If it does, it will be added to newList. Using lowercase eliminates
                    // issues with capitalization in search terms and search content
            return lc.includes(filter);
        });
        console.log(newList);
        } else {
                // If the search bar is empty, set newList to original task list
        newList = this.state.runs;
        }
            // Set the filtered state based on what our rules added to newList
        this.setState({
        filtered: newList
        });
  }


    render() {

        return (
            <div className="runs-container">
                {
                    !this.state.isLoading && this.state.runs.length === 0 ? (
                        <div className="no-runs-found">
                            <br/>   
                            <span>No Runs Found.</span>
                        </div>    
                    ): null
                }  
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
                <div className="runs-list-scroll">
                <div>
                    <br/>
                    <input type="text" className="search-input" onChange={this.handleChange} placeholder="Search Run Locations ..." />
                    <ul>
                    ...
                    </ul>
                </div>  
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                    pageSize: 5,
                    }}
                    dataSource={this.state.filtered}
                    renderItem={item => (
                        <List.Item
                        key={item.id}
                        actions={this.props.currentUser && this.props.userRun ? [
                            <Icon type="delete" key="list-vertical-delete" onClick = {(event) => this.handleDelete(event,item.id)}/>,
                    ] : [ <Icon type="user-add" key="list-vertical-user-add" onClick = {(event) => this.handleJoin(event,item)} />]} >
                        <List.Item.Meta
                        title={item.title}
                        />
                        Location: {item.location} 
                        <br />
                        Time: {item.creationDateTime}
                    </List.Item>
                    )}
                />
                
                </div>
            </div>
        );
    }
}

export default withRouter(RunList);