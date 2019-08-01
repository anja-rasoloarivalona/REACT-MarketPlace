import React, { Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/FormInput/FormInput';
import './Login.css';
import Auth from '../Auth';
import Button from '../../../components/Button/Button';
import { validator } from '../../../util/validators';
import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler';
import IconSvg from '../../../util/svgHandler';
import Spinner from '../../../components/Spinner/Spinner';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';


class Login extends Component {

    state = {
        loginForm: {
            email: {
                value: '',
                errorLabel: 'An email',
            },
            password: {
                value: '',
                errorLabel: 'A password',
            }
        },
        error: null,
        token: null,
        userId: null,
        loading: false
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    closeErrorHandler = () => {
        this.setState({ error: null})
    }


    loginHandler = (e, loginFormData) => {
        e.preventDefault();
        this.setState({loading: true})
       
          const errors = validator(
            loginFormData.email, 
            loginFormData.password
         )

            if(errors.length > 0){
                this.setState({ error : errors, loading: false});
                return
            }

        fetch('https://strix-market-place.herokuapp.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email: loginFormData.email.value,
                password: loginFormData.password.value
            })
        })
        .then(res => {
            if(res.status === 422) {
                throw new Error('validation failed.');
            }
            if(res.status === 401) {
                throw new Error('Wrong email address or password. Please try again')
            }
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Could not authenticate you! Please try again')
            }

            return res.json();       
        })

        .then(resData => {
            this.props.loginSucceeded(resData);
            localStorage.setItem('token', resData.token);
            localStorage.setItem('userId', resData.userId);
            const remainingMilliseconds = 60 * 60 * 1000; 
            const expiryDate = new Date(  new Date().getTime() + remainingMilliseconds  );
            localStorage.setItem('expiryDate', expiryDate.toISOString());         
        })
        .then(() => {
            let productsInCart = JSON.parse(localStorage.getItem('productsInCart'));
            if(productsInCart){
                const token = localStorage.getItem('token');
                const connectedUserId = localStorage.getItem('userId');
                this.props.setProductsInCart(productsInCart, token, connectedUserId);
            }
            this.props.history.replace('/admin/products');           
        })
        .catch(err => {
            let error = []
            error.push(err.message)
            this.setState({
                error: error,
                loading: false
            })
            this.props.loginFailed();
        })
    }





    inputChangeHandler = (input, value) => {
       this.setState(prevState => {
           const udpatedForm = {
               ...prevState.loginForm,
               [input] : {
                   ...prevState.loginForm[input],
                   value: value
               }
           }
           return {
               loginForm: udpatedForm
           }
       })
    }



    render() {

        let form;
        if(this.state.loading === true){
            form = <Spinner />
        } else {
            form = (
            <form className="auth__form flex-centered-column"
                    onSubmit={ e => (
                        this.loginHandler(e, this.state.loginForm))}
                    noValidate>    

                        <div className="login__title flex-centered-row">Log In
                            <IconSvg icon="user"/>
                        </div>
                        <Input 
                            id='email'
                            label='email'
                            type='email'
                            control='input' //to make sure that it's an input field
                            onChange={this.inputChangeHandler}
                            required={true}
                            value={this.state.loginForm['email'].value}     
                        />
                        <Input 
                            id='password'
                            label='password'
                            type='password'
                            control='input' 
                            onChange={this.inputChangeHandler}
                            required={true}
                            value={this.state.loginForm['password'].value}
                        />
                        <div className="login__cta">
                                <Link to='/signup'>Don't have an account?</Link>
                                <div>Forget password</div>
                            </div>
                        <Button type="submit" color="secondary">
                            Login
                        </Button>
                </form>
            )
        }
        return (    
            <Fragment> 
            <ErrorHandler error = {this.state.error}
                          onCloseError={this.closeErrorHandler}/> 
            <Auth>
                {form}
            </Auth> 
            </Fragment>     
            
        )
     }
}         

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginSucceeded: (data) => dispatch(actions.loginSucceeded(data)),
        loginFailed: () => dispatch(actions.loginFailed()),

        setProductsInCart: (products, token, userId) => dispatch(actions.setProductsInCart(products, token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
