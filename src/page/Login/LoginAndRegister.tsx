import { useFormik } from 'formik';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import * as Yup from 'yup'
import { DispatchType } from '../../redux/configStore';
import { UserLoginModel, UserRegisterModel, postUserLogin, postUserRegister } from '../../redux/reducer/UserReducer';
import { history } from '../../utils/lib/lib';
type Props = {}

const Login = (props: Props) => {
  const [active,setActive]= useState<boolean>(true);
  const dispatch:DispatchType= useDispatch();
  const frmRegister= useFormik<UserRegisterModel>({
    initialValues:{
        email:'',
        password:'',
        confirmPassword:'',
        name:'',
        phoneNumber:''
    },
    onSubmit:(values:UserRegisterModel)=>{
        dispatch(postUserRegister(values))
        console.log(values)
    },
    validationSchema:Yup.object().shape({
        email:Yup.string().email('Email is not valid !').required('Email must not be empty !'),
        password:Yup.string().required('Password must not be empty !'),
        confirmPassword:Yup.string().oneOf([Yup.ref('password')],'Confirm password is not match !').required('Confirm password must not be empty !'),
        name:Yup.string().required('Name must not be empty !'),
        phoneNumber:Yup.string().matches(/^[0-9]{10}$/, 'Telephone is not valid !').required('Telephone must not be empty !')
    })
  })

  const frmLogin= useFormik<UserLoginModel>({
    initialValues:{
        email:'',
        passWord:''
    },
    onSubmit:(values:UserLoginModel)=>{
        dispatch(postUserLogin(values));
    }
  })
  return (
    <div className={`container ${active ? "" :"active"} `} id="container">
    <div className="form-container sign-up">
        <form className='content' onSubmit={frmRegister.handleSubmit}>
            <h1>Create Account</h1>
            <div className="social-icons">
                <a href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-github"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registeration</span>
            <input type="text" name='name' onChange={frmRegister.handleChange} placeholder="Name"/>
            <p className='error'>{frmRegister.errors.name!==''? frmRegister.errors.name : ''}</p>
            <input type="email" name='email' onChange={frmRegister.handleChange} placeholder="Email"/>
            <p className='error'>{frmRegister.errors.email!==''? frmRegister.errors.email : ''}</p>
            <input type="password" name='password' onChange={frmRegister.handleChange} placeholder="Password"/>
            <p className='error'>{frmRegister.errors.password!==''? frmRegister.errors.password : ''}</p>
            <input type="password" name='confirmPassword' onChange={frmRegister.handleChange} placeholder="Confirm password"/>
            <p className='error'>{frmRegister.errors.confirmPassword!==''? frmRegister.errors.confirmPassword : ''}</p>
            <input type="text" name='phoneNumber' onChange={frmRegister.handleChange} placeholder="Phone number"/>
            <p className='error'>{frmRegister.errors.phoneNumber!==''? frmRegister.errors.phoneNumber : ''}</p>
            <button type='submit'>Sign Up</button>
        </form>
    </div>
    <div className="form-container sign-in">
        <form className='content'onSubmit={frmLogin.handleSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-github"></i></a>
                <a  href="abc" onClick={(e)=>{e.preventDefault()}} className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email password</span>
            <input type="text" name='email' onChange={frmLogin.handleChange} placeholder="Email"/>
            <input type="password" name='passWord' onChange={frmLogin.handleChange} placeholder="Password"/>
            <a href="#">Forget Your Password?</a> <br />
            <button type='submit'>Sign In</button>
        </form>
    </div>
    <div className="toggle-container">
        <div className="toggle">
            <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button className="hidden" id="login" onClick={()=>{
                  setActive(true)
                  history.push('/login')
                }}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <button className="hidden " id="register" onClick={()=>{
                  setActive(false)
                  history.push('/register')
                }}>Sign Up</button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Login

