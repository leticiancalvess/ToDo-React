
import './App.css';
import {useState, useEffect } from 'react';
import {BsTRash, BsBookmarkCheck, BsBookmarkCheckFill, BsTrash} from 'react-icons/bs';

const API = "http://localhost:5000";


function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todos on page load 

  useEffect(() => {
    const loadData = async() => {
      setLoading(true)
      const res = await fetch(API + "/todos").then((res) => res.json()).then((data) => data).catch((err) => console.log(err)); //nao precisa configurar requisiçao pq o padrão já é get

      setLoading(false)

      setTodos(res);
    }
    loadData();
  }, []) //vazio = executado qnd a pagina carrega

  const handleSubmit = async (e) => {
    e.preventDefault();

    const  todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo), //manda o body como uma string
      headers: { //cabeçalho
        "Content-Type": "application/json"
      }
    })

    setTodos((prevState) => [...prevState, todo]) //prevState é o estado anterior do item, podendo adicionar item ao estado anterior e atualizando o estado. Assim, não será necessário atualizar a pagina para ver a nova tarefa que foi adicionada.
    setTitle("");  //para limpar o formulário
    setTime("");
  }

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id)) //faz comparação, vai retornar todos os toDo com o id diferente do que foi excluído. mesmo caso acima, onde seria preciso atualizar a página.
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done
   const data =  await fetch(API + "/todos/" + todo.id, {
      method: "PUT", 
      body: JSON.stringify(todo),
      headers: { //cabeçalho
        "Content-Type": "application/json"
      },

    })
    setTodos((prevState) => prevState.map((t) => (t.id === data.id) ? (t = data) : t))
  }
  
if(loading) {
  return <p>Carregando...</p>
}

  return (
    <div className="App">
     <div className='todo-header'>
      <h1>
        React To Do
      </h1>
     </div>
     <div className='form-todo'>
      <h2>Insira a sua próxima tarefa: </h2>
      <form onSubmit={handleSubmit}> 
      <div className='form-control'>
        <label htmlFor="title">O que você vai fazer?</label>
        <input type="text" name="title" placeholder='Título da tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required/>
      {/*coloca no title o valor do input */}
      </div>
      <div className='form-control'>
        <label htmlFor="time">Duração:</label>
        <input type="text" name="time" placeholder='Tempo estimado em horas' onChange={(e) => setTime(e.target.value)} value={time || ""} required/>
      {/*coloca no time o valor do input */}
      </div>

      
      
      <input type="submit" value="Criar tarefa"/>
      </form>
     </div>
     <div className='list-todo'> 
     <h2>Lista de tarefas: </h2>
     {todos.length === 0 && <p>Não há tarefas</p>}
     {todos.map((todo) => (
      <div className='todo' key={todo.id}> 
      <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
      <p>Duração: {todo.time} </p>
      <div className='actions'>
        <span onClick={() => handleEdit(todo)}>
          {todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
        </span>
        <BsTrash onClick={() => handleDelete(todo.id)}/>
       </div>
       </div>
     ))}
    </div>
    </div>
  );
}

export default App;
