import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarCategoryList.css';

import IconSvg from '../../../../util/svgHandler';

import Furniture from '../../../../assets/icon/SVG/furniture.svg';
import Clothes from '../../../../assets/icon/SVG/clothes.svg';
import Television from '../../../../assets/icon/SVG/television.svg';
import ReactSVG from 'react-svg';
import { FormattedMessage } from 'react-intl';


const sidebarCategoryList = props => {

    const category = [
        "automobile", "laptop", "smartphone", "headphones",
    ]

    /*For some reason, the sprite is broken when using those svg, we'll try to fix this later*/

    const category2 = [
        {title: "clothes", src: Clothes }, 
        {title: "television", src: Television },  
        {title: "furniture", src: Furniture }
    ]


    return  (
        <ul className={["sidebar__category__list",
                                "flex-centered-column",
                                props.hideCategoryFilter ? 'sidebar__category__list--hide' : ''].join(' ')}>
                   
                    { category.map( category => (
                        
                        <NavLink 
                              onClick={props.hideCategoryFilterHandlerOnMobile.bind(this, category)}
                              key={category} 
                              to={`${category}`}
                              className="sidebar__category__list__item">
                                <IconSvg icon={category} size="big"/>
                                <span className="sidebar__category__list__item__title">
                                    <FormattedMessage id={`${category}.sidebar`} defaultMessage={category}/>
                                </span>
                        </NavLink>
                    ))}

                    { category2.map( category => (
                        <NavLink 
                        onClick={props.hideCategoryFilterHandlerOnMobile.bind(this, category.title)} 
                            key={category.title} 
                              to={`${category.title}`}
                              className="sidebar__category__list__item">
                                <ReactSVG src={category.src} className={`icon icon--${category.title}`}/>
                                <span className="sidebar__category__list__item__title">
                                        <FormattedMessage id={`${category.title}.sidebar`} defaultMessage={category.title}/>
                                </span>
                        </NavLink>
                    ))}

                {props.children}
        </ul>
    )
}
  


export default sidebarCategoryList
