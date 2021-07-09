import { useEffect, useState } from 'react';
import './App.css';
import Amplify, { Analytics, Auth, API } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import * as mutations from './graphql/mutations'

Amplify.configure(awsconfig)

function App() {
  const [username, setUsername] = useState('');
  const [todo, setTodo] = useState('');

  useEffect(() => {
    Analytics.record('Home Page Visit')
    Analytics.record({
      name: "UserSignIn",
      attribute: {
        username: "Api Demo"
      }
    })
    Auth.currentAuthenticatedUser().then(user => {
      setUsername(user.username);
    })

  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const todoDetails = {
      name: username,
      description: todo
    }
    const newTodo = await API.graphql({ query: mutations.createTodo, variables: { input: todoDetails } })
  }
  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <h2>{username}</h2>
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="todo" id="todo" onChange={e => setTodo(e.target.value)} />
          <button type='submit'>Submit</button>
        </form>
        <p>Todo:{todo}</p>
      </header>
    </div>
  );

}

export default withAuthenticator(App);
