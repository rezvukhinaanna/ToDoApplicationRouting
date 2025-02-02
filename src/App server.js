import "./App.css";
import { useEffect, useState } from "react";
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
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editWord, setEditWord] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      });
  }, []);

  const addNewTask = () => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Edit your new task",
        completed: false,
      }),
    }).then(() => fetchTasks());
  };

  const fetchTasks = () => {
    fetch("http://localhost:5000/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  };

  const updateTask = (id) => {
    if (!editWord.trim()) return;
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editWord,
        completed: false,
      }),
    }).then(() => {
      setEditingTaskId(null);
      setEditWord("");
      fetchTasks();
    });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    }).then(() => fetchTasks());
  };

  const [searchWord, setSearchWord] = useState("");
  const [filterWord, setFilterWord] = useState([]);
  const [isItFiltered, setIsItFiltered] = useState(false);
  const [sort, setSort] = useState([]);
  const [isItSorted, setIsItSorted] = useState(false);

  const onCheckWord = ({ target }) => {
    const value = target.value.toLowerCase();
    setSearchWord(value);
    setFilterWord(
      tasks.filter((task) => task.title.toLowerCase().includes(value))
    );
    setIsItFiltered(true);
    setIsItSorted(false);
  };

  const sortFunction = () => {
    setSort([...tasks].sort((a, b) => a.title.localeCompare(b.title)));
    setIsItSorted(true);
    setIsItFiltered(false);
  };

  const navigate = useNavigate();
  const stepBack = () => navigate(-1);

  const MainPage = () => (
    <div className="mainPageWitfTodoList">
      <input
        type="text"
        placeholder="Начните вводить дело"
        className="search"
        value={searchWord}
        onChange={onCheckWord}
      />
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
      <hr />
      <div className="myListofTask">
        <div className="title">Мой список дел:</div>
        <div className="buttonTasks">
          <button onClick={addNewTask}>Добавить новое дело</button>
        </div>
      </div>
    </div>
  );

  const TaskList = () => (
    <div className="taskList">
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        (isItSorted ? sort : isItFiltered ? filterWord : tasks).map(
          ({ id, title }) => (
            <div key={id} className="task">
              <Link to={`/task/${id}`}>
                {title.length > 30 ? title.slice(0, 30) + "..." : title}
              </Link>
            </div>
          )
        )
      )}
      <Outlet />
    </div>
  );

  const Task = () => {
    const { id } = useParams();
    const taskItem = tasks.find((task) => task.id === id);
    if (!taskItem) return <div>Задача не найдена</div>;

    return (
      <div key={id} className="task-detail">
        <button className="editTask-stepback" onClick={stepBack}>
          ⬅︎
        </button>
        <div className="task-detail-title">Название: {taskItem.title}</div>
        <div className="isTaskComplited">
          Статус: {taskItem.completed ? "✅ Завершено" : "❌ Не завершено"}
        </div>
        {editingTaskId === id ? (
          <>
            <input
              type="text"
              className="editWord-input"
              value={editWord}
              onChange={(e) => setEditWord(e.target.value)}
              autoFocus
            />
            <button className="save-button" onClick={() => updateTask(id)}>
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
        <button className="editTask" onClick={() => deleteTask(id)}>
          Удалить
        </button>
      </div>
    );
  };

  const NotFound = () => (
    <div>Вы перешли на неизвестный URL-адрес. Страница не найдена.</div>
  );
  const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/task" element={<TaskList />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      {location.pathname === "/" && <TaskList />}
    </div>
  );
}

export default App;
