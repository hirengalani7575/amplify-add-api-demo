import { useEffect, useState } from 'react';
import './App.css';
import { Analytics, API, Auth } from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'

Amplify.configure(awsconfig)

function App() {
  const [username, setUsername] = useState('');
  const [todo, setTodo] = useState('');
  const [listTodo, setListTodo] = useState('');
  const [postedTodo, setPostedTodo] = useState('');


  useEffect(() => {
    async function getAllTodos() {
      const allTodos = await API.graphql({ query: queries.listTodos })
      setListTodo(allTodos.data.listTodos.items)
    }

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
    getAllTodos();
  }, [postedTodo])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const todoDetails = {
      name: username,
      description: todo
    }
    const newTodo = await API.graphql({ query: mutations.createTodo, variables: { input: todoDetails } })
    setPostedTodo(newTodo)
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>API Demo</h1>
        <AmplifySignOut />
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="todo" id="todo" onChange={e => setTodo(e.target.value)} />
          <button type='submit'>Submit</button>
        </form>
        <p>Todo: {todo}</p>
        {listTodo && listTodo.map(item =>
          <li key={item.id}>
            {item.description}

          </li>

        )}
      </header>
    </div>
  );

}

export default withAuthenticator(App);
