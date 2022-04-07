import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [email, setEmail] =useState('')
  const [password, setPassword] =useState('')
  const [validated, setValidated] = useState(false);
  const [registered , setRregistered] = useState(false)
  const [ error , setError] = useState('')

  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  }
  const handlePassBlur = (e) => {
    setPassword(e.target.value);
  }

  const handleRegistered = event =>{
    setRregistered(event.target.checked);
  }

  const handleFromSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
     
      event.stopPropagation();
      return ;
    }
    if(!/(?=.*?[0-9])/.test(password)){
      setError('Password Should contain atleast 1 number!!')
      return;
    }

    setValidated(true);
    setError('')
    // console.log("submited" , email , password);
    if(registered){
      signInWithEmailAndPassword(auth , email , password)
      .then(result =>{
        const user = result.user
        console.log(user);
      })
      .catch(error =>{
        console.log(error);
        setError(error.message)
      })

    }
    else{
      createUserWithEmailAndPassword(auth , email , password)
    
    .then(result =>{
      const user = result.user
      console.log(user);
      setEmail('')
      setPassword('')
      verifyEmail();
    })
    .catch(error =>{
      console.log(error);
      setError( error.message)
    })
    }
    event.preventDefault()
  }


  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log("Email verification");
    })
  }
  const passwordReset = () =>{
    sendPasswordResetEmail(auth , email)
    .then(()=>{
      console.log("send email");
    })
  }
  return (
    <div >
      <div className="regristration w-50 mx-auto">
        <h2 className='text-primary my-3'>Please {registered ? 'login ': 'Registar'} </h2>
      <Form noValidate validated={validated} onSubmit={handleFromSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required  type="email" placeholder="Enter email" onBlur={handleEmailBlur} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" placeholder="Password" onBlur={handlePassBlur} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <button onClick={passwordReset} className='btn btn-primary'> Forget Password?</button>
        <p>{error}</p>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegistered} type="checkbox" label="Already Registered!!" />
        </Form.Group>
        <Button variant="primary" type="submit" >
        {registered ? ' login': 'Registar '}
        </Button>
      </Form>
      </div>
    </div>
  );
}

export default App;
