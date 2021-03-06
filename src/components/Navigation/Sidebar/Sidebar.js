import React, { Component } from 'react'
import './Sidebar.css';
import InputRange from '../../../components/FormInput/InputRange/InputRange';
import SidebarCategoryToggler from './SidebarToggler/SidebarCategoryToggler';
import SideBarCategoryList from './SidebarCategoryList/SidebarCategoryList';
import IconSvg from '../../../util/svgHandler';
import { connect } from 'react-redux';
import * as shopActions from '../../../store/actions/index';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';


const messages =  defineMessages({
    first: {
        id: 'sortBy.latest',
        defaultMessage: 'latest'
    },
    second: {
        id: 'sortBy.lowToHigh',
        defaultMessage: 'price: low to high'
    },
    third: {
        id: 'sortBy.highToLow',
        defaultMessage: 'price: high to low'
    }
})

class Sidebar extends Component {

    state = {
        hideCategoryFilter : false,
        hidePriceFilter: false,
        windowWidth: 0
    }

    componentWillMount(){
        this.setState({
            windowWidth : window.innerWidth,
            hideCategoryFilter: window.innerWidth < 1199 ? true : false,
            hidePriceFilter: window.innerWidth < 1199 ? true : false
        })      
    } 

    hideCategoryFilterHandler = ()=> {
        this.setState(prevstate => ({
            hideCategoryFilter: !prevstate.hideCategoryFilter
        }))
    }

    hideCategoryFilterHandlerOnMobile = (category) => {
        if(this.state.windowWidth < 1199){
            this.setState(prevstate => ({
                hideCategoryFilter: !prevstate.hideCategoryFilter
            }))
        }

        let val = {
            min: 1,
            max: 99998
        }

        let history = null;
        this.props.categoryHandler(val, history, category, this.props.sortBy);
    }


    hidePriceFilterHandler = ()=> {
        this.setState(prevstate => ({
            hidePriceFilter: !prevstate.hidePriceFilter
        }))
    }

    

    render() {
        const {formatMessage} = this.props.intl;
        
        return (
            <section className={["sidebar", 
                                 this.state.hideCategoryFilter === false ? 'sidebar--show__cat' : ' ',
                                 this.state.hidePriceFilter === false ? 'sidebar--show__price' : ' '].join(' ')}>

                <SidebarCategoryToggler hideCategoryFilterHandler = {this.hideCategoryFilterHandler} 
                                        hideCategoryFilter = {this.state.hideCategoryFilter}/>

                <SideBarCategoryList hideCategoryFilter = {this.state.hideCategoryFilter}
                                     hideCategoryFilterHandlerOnMobile ={this.hideCategoryFilterHandlerOnMobile}>

                <div className="sidebar__price">

                    <div className={["sidebar__price__title", "flex-centered-row", this.state.hidePriceFilter === false ? 'rotateIcon' : ''].join(' ')}
                        onClick = {this.hidePriceFilterHandler}>
                        <span><FormattedMessage id='filterByPrice.sidebar' defaultMessage='Filter by price'/></span> 
                        <span>${this.props.priceRangeRequested.min} - ${this.props.priceRangeRequested.max}</span> 

                        <IconSvg icon="down"/>
                    </div>  

                    <div className={["sidebar__price__input", "flex-centered-row",
                            this.state.hidePriceFilter ? 'sidebar__price__input--hide' : ''].join(' ')}>
                        <InputRange {...this.props}/>
                    </div>  
                </div>


                <div className={["sidebar__sort", this.state.hidePriceFilter ? "sidebar__sort__goTop" : ''].join(' ')}>
                    <span>
                            <FormattedMessage id='sortBy.sidebar' defaultMessage='Sort by'/>
                    </span>
                    <select value={this.props.sortBy}
                            name="filter" 
                            onChange={e => this.props.sortbyhandler(e)}>
                        <option value="latest">{formatMessage(messages.first)}</option>
                        <option value="low_to_high">{formatMessage(messages.second)}</option>
                        <option value="high_to_low">{formatMessage(messages.third)}</option>
                    </select>
                    
                </div>
              
                </SideBarCategoryList>
     
                
                

                

            </section>
        )
    }
}



const mapStateToProps = state => {
    return {
        sortBy: state.products.sortBy
    }
}

const mapDispatchToProps = dispatch => {
    return {
        categoryHandler: (val, history, category, sortBy) => dispatch(shopActions.categoryHandler(val, history, category, sortBy))
    }
}


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
