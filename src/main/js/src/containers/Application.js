import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { connectStomp, disconnectStomp, deleteFromSow } from '../actions';
import { Switch, Card, CardTitle, CardText, CardMenu, IconButton, Layout, Content, Header, Grid, Cell } from 'react-mdl';

class Application extends Component {
        
    onChange = e => {
        e.preventDefault();
        const {connected, dispatch} = this.props;
        if (connected) {
            dispatch( disconnectStomp() );
        } else {
            dispatch( connectStomp() );
        }
    }
    
    onDelete = (element, e) => {
        e.preventDefault();
        const {connected, dispatch} = this.props;
        dispatch( deleteFromSow(element) )
    }
    
    renderCard = element => {
        return (
            <Cell key={element['@id']} col={2}>    
                <Card shadow={0} style={{width: '100%'}}>
                    <CardTitle expand style={{color: '#FFF', background: '#3E4EB8'}}>{element['label']}</CardTitle>
                    <CardText>{element['comment']}</CardText>
                    <CardMenu style={{color: '#FFF'}}>
                        <IconButton name="delete" onClick={this.onDelete.bind(this, element)}/>
                    </CardMenu>
                </Card>
            </Cell>
        );
    }

    render() {
        const {connected, connecting, disconnecting, graph} = this.props;
        const content = _.filter(graph['@graph'], {'@type': 'owl:Thing'});
        return (
            <div>
                <Layout fixedHeader>
                    <Header title='Streaming Linked Data to Web UI'>
                    </Header>
                    <Content>
                        <Grid>
                            <Cell col={12}>
                                <Switch id="switch" ripple checked={connected} onChange={this.onChange}>WebSocket connection</Switch>
                            </Cell>
                        </Grid>
                        <Grid>
                            { _.map(content, this.renderCard) }
                        </Grid>
                    </Content>
                </Layout>
            </div>
        );
    }
}

Application.propTypes = {
    connected: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    const { connection, sow } = state;
    const { connected, connecting, disconnecting } = connection;
    const { graph } = sow;
    return {
        connected,
        connecting,
        disconnecting,
        graph
    };
}

export default connect(mapStateToProps)(Application)