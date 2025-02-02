import "./App.css";
import { useEffect, useState } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { tasks } from "./firebase";
import {
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

function App() {
  const [task, setTask] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [newTask, setNewTask] = useState(false);

  useEffect(() => {
    const tasksDbRef = ref(tasks, "tasks");
    return onValue(tasksDbRef, (snapshot) => {
      const loadedTasks = snapshot.val() || [];
      setTask(loadedTasks);
      setIsLoading(false);
    });
  }, []);

  const addNewTask = () => {
    const pushedTask = ref(tasks, "tasks");
    push(pushedTask, {
      title: "Edit your new task",
      completed: false,
    }).then((response) => console.log(response));
  };

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editWord, setEditWord] = useState("");

  const onEditWord = (e) => {
    console.log(e);
    setEditWord(e.target.value);
  };

  const updateTask = (id) => {
    if (!editWord.trim()) return;
    const updatedTask = ref(tasks, `tasks/${id}`);
    set(updatedTask, {
      title: editWord,
      completed: false,
    }).then(() => {
      setEditingTaskId(null);
      setEditWord("");
    });
  };

  const deleteTask = ({ id }) => {
    const deletedTask = ref(tasks, `tasks/${id}`);
    console.log(`tasks/${id}`);
    remove(deletedTask).then((response) => console.log("delete task!"));
  };

  const [searchWord, setsearchWord] = useState("");
  const [filterWord, setFilterWord] = useState([]);
  const [isItFiltered, setIsItFiltered] = useState(false);

  const onCheckWord = ({ target }) => {
    const value = target.value.toLowerCase();
    setsearchWord(value);

    const filtered = Object.entries(task).filter(([id, task]) =>
      task.title.toLowerCase().includes(value)
    );

    setFilterWord(filtered);
    setIsItFiltered(true);
    setIsItSorted(false);
  };

  const [sort, setSort] = useState([]);
  const [isItSorted, setIsItSorted] = useState(false);
  const sortFunction = () => {
    const sortedList = Object.entries(task).sort(([idA, taskA], [idB, taskB]) =>
      taskA.title.localeCompare(taskB.title)
    );
    setSort(sortedList);
    setIsItSorted(true);
    setIsItFiltered(false);
  };
  const navigate = useNavigate();
  const stepBack = () => {
    navigate(-1);
  };

  const MainPage = () => {
    return (
      <div className="mainPageWitfTodoList">
        <input
          type="text"
          placeholder="Начните вводить дело"
          className="search"
          value={searchWord}
          onChange={onCheckWord}
          
        ></input>
        <button className="filter-althabit-button" onClick={sortFunction}>
          Фильтрация по алфавиту
        </button>
        <button
          className="filter-althabit-button-delete"
          onClick={() => {
            setIsItFiltered(false);
            setIsItSorted(false);
          }}
        >
          Сбросить фильтры
        </button>
        <hr></hr>
        <div className="myListofTask">
          <div className="title">Мой список дел:</div>
          <div className="buttonTasks">
            <button onClick={addNewTask}>Добавить новое дело</button>
          </div>
        </div>
      </div>
    );
  };

  const TaskList = () => {
    return (
      <div className="taskList">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          (isItSorted
            ? sort
            : isItFiltered
            ? filterWord
            : Object.entries(task)
          ).map(([id, { title }]) => (
            <div key={id} className="task">
              <Link to={`/task/${id}`}>
                {title.length > 30 ? title.slice(0, 30) + "..." : title}
              </Link>
            </div>
          ))
        )}
        <Outlet />
      </div>
    );
  };

  const Task = () => {
    const { id } = useParams();
    const taskItem = task && task[id];
    if (!taskItem) {
      return <div>Задача не найдена</div>;
    }

    return (
      <div key={id} className="task-detail">
        <button className="editTask-stepback" onClick={() => stepBack()}>
          ⬅︎
        </button>
        <div>
          <div className="task-detail-title">Название: {taskItem.title}</div>
        </div>
        <div className="isTaskComplited">
          Статус: {taskItem.completed ? "✅ Завершено" : "❌ Не завершено"}
        </div>
        {editingTaskId === id ? (
          <>
            <input
              type="text"
              className="editWord-input"
              value={editWord}
              onChange={onEditWord}
              autoFocus
            ></input>
            <button
              className="save-button"
              onClick={() => {
                updateTask(id);
              }}
            >
              Сохранить
            </button>
          </>
        ) : (
          <button
            className="editTask-update"
            onClick={() => {
              setEditingTaskId(id);
              setEditWord(taskItem.title);
            }}
          >
            Обновить
          </button>
        )}
        <button className="editTask" onClick={() => deleteTask({ id })}>
          Удалить
        </button>
      </div>
    );
  };

  const NotFound = () => {
    return <div>Вы перешлина неизвестный URL-адрес. Страница не найдена.</div>;
  };

  const location = useLocation();

  return (
    <div className="App">
      <div>
        <Link to="/"></Link>
        <Link to="/task"></Link>
      </div>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/task" element={<TaskList />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="/404" element={<NotFound />}></Route>
        <Route path="*" element={<Navigate to="/404" />}></Route>
      </Routes>
      {location.pathname === "/" && <TaskList />}
    </div>
  );
}

export default App;
