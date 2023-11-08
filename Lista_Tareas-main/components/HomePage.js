import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
// Importaciones de otros módulos y librerías
import { useMemo } from "react";

export async function getTasks() {
  const response = await fetch("http://127.0.0.1:8000/aplicacion/api/tareas/");
  const tasks = await response.json();
  return tasks;
}

export async function getStaticPaths() {
  const tasks = await fetch(
    "http://127.0.0.1:8000/aplicacion/api/tareas/",
  ).then((response) => response.json());
  const paths = tasks.map((task) => ({
    params: {
      id: task.id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function HomePage() {
  // Definición de estados
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [filteredAndSortedTasks, setFilteredAndSortedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState("");
  const [animateTitle, setAnimateTitle] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    // Obtener tareas iniciales
    getTasks().then((tasks) => {
      setTasks(tasks);
      setAllTasks(tasks);
    });
  }, []);

  const handleToggleComplete = async (taskId, currentCompletedState) => {
    // Cambiar estado de completado de una tarea
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/aplicacion/api/tareas/${taskId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completado: !currentCompletedState }),
        },
      );
      if (response.ok) {
        const updatedTask = await response.json();
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? { ...task, completado: !currentCompletedState }
            : task,
        );
        setTasks(updatedTasks);
      } else {
        console.error("Error al cambiar el estado de la tarea.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleTitleChange = (e, taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      taskToUpdate.editedTitle = e.target.value;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? taskToUpdate : task)),
      );
    }
  };

  const handleDescriptionChange = (e, taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      taskToUpdate.editedDescription = e.target.value;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? taskToUpdate : task)),
      );
    }
  };

  useEffect(() => {
    // Filtrar y ordenar tareas
    const filteredTasks = tasks
      .filter(
        (task) =>
          (task.titulo &&
            task.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (task.descripcion &&
            task.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .filter((task) => !filterCompleted || task.completado)
      .sort((a, b) => {
        if (sortByDate === "asc") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortByDate === "desc") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
    setFilteredAndSortedTasks(filteredTasks);
  }, [searchTerm, sortByDate, filterCompleted, tasks]);

  const handleEditTask = async () => {
    // Editar una tarea
    if (!editedTask) {
      return;
    }
    const taskId = editedTask.id;
    const updatedTitle = editedTask.editedTitle;
    const updatedDescription = editedTask.editedDescription;
    if (updatedTitle === "" || updatedDescription === "") {
      console.error("El título y la descripción son obligatorios.");
      return;
    }
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/aplicacion/api/tareas/${taskId}/`,
        {
          titulo: updatedTitle,
          descripcion: updatedDescription,
        },
      );
      if (response.status === 200) {
        const updatedTask = response.data;
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        );
        setTasks(updatedTasks);
        setEditedTask(null);
      } else {
        console.error("Error al actualizar la tarea.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleAddTask = async (e) => {
    // Agregar una nueva tarea
    e.preventDefault();
    if (newTask.title.trim() === "" || newTask.description.trim() === "") {
      console.error("El título y la descripción son obligatorios.");
      return;
    }
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/aplicacion/api/tareas/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        },
      );
      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]);
        setNewTask({
          title: "",
          description: "",
          completed: false,
        });
        fetchTasks();
      } else {
        console.error("Error al agregar la tarea.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleSaveClick = async (taskId) => {
    // Guardar cambios en una tarea
    if (!editedTask) {
      return;
    }
    const updatedTitle = editedTaskTitle;
    const updatedDescription = editedTaskDescription;
    if (updatedTitle === "" || updatedDescription === "") {
      console.error("El título y la descripción son obligatorios.");
      return;
    }
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/aplicacion/api/tareas/${taskId}/`,
        {
          titulo: updatedTitle,
          descripcion: updatedDescription,
        },
      );
      if (response.status === 200) {
        const updatedTask = response.data;
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        );
        setTasks(updatedTasks);
        setEditedTask(null);
      } else {
        console.error("Error al actualizar la tarea.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleEditClick = (taskId) => {
    setTaskId(taskId);
    if (taskId === undefined || taskId === null) {
      return;
    }
    const linkMemo = useMemo(() => {
      // Generar enlace de edición
      if (taskId === undefined || taskId === null) {
        return null;
      }
      return <Link href={`/api/tareas/${taskId}`}>Editar</Link>;
    }, [taskId]);

    return link;
  };

  useEffect(() => {
    const task = tasks.find((task) => task.id === taskId);
    setEditedTask(task);
  }, [taskId]);

  const linkMemo = useMemo(() => handleEditClick(), [tasks]);

  const handleCompleteTask = async (taskId) => {
    // Marcar una tarea como completada
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/aplicacion/api/tareas/${taskId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completado: true }),
        },
      );
      if (response.ok) {
        const updatedTask = await response.json();
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, completado: true } : task,
        );
        setTasks(updatedTasks);
      } else {
        console.error("Error al marcar la tarea como completada.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Eliminar una tarea
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/aplicacion/api/tareas/${taskId}/`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error("Error al eliminar la tarea.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor.", error);
    }
  };

  const handleFilterChange = () => {
    // Cambiar filtro de tareas completadas
    setFilterCompleted((prevFilterCompleted) => !prevFilterCompleted);
  };

  useEffect(() => {
    const filteredTasks = filterCompleted
      ? tasks.filter((task) => task.completado)
      : tasks;
    setFilteredAndSortedTasks(filteredTasks);
  }, [tasks, filterCompleted]);

  const handleSearchChange = (e) => {
    // Manejar cambios en la búsqueda
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setEditedTaskTitle(editedTaskTitle);
  }, [editedTaskTitle]);

  useEffect(() => {
    setEditedTaskDescription(editedTaskDescription);
  }, [editedTaskDescription]);

  // Renderizar componente
  return (
    <div className={`index ${animateTitle ? "animate" : ""}`}>
      <nav className="links">
        <Link href="/Register" className={`link1 ${isVisible ? "active" : ""}`}>
          Registrarse
        </Link>
        <Link href="/Login" className={`link2 ${isVisible ? "active" : ""}`}>
          Iniciar Sesión
        </Link>
      </nav>
      <h2 className={`tareas ${isVisible ? "active" : ""}`}>Tareas</h2>
      <div>
        <button
          onClick={() =>
            (window.location.href = `http://127.0.0.1:8000/aplicacion/api/tareas`)
          }
          className="crear-tareas"
        >
          Crear Tareas
        </button>
      </div>
      <label className="mostrar-tareas-completas1">
        Mostrar tareas completadas:
        <input
          type="checkbox"
          checked={filterCompleted}
          onChange={handleFilterChange}
          className="mostrar-tareas-completas2"
        />
      </label>
      <input
        type="text"
        placeholder="Buscar tarea..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <label className="ordenar-fecha-titulo">
        <b>Ordenar por fecha:</b>
        <select
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value)}
          className="ordenar-fecha"
        >
          <option value="asc" className="nuevas-viejas">
            Viejas a Nuevas
          </option>
          <option value="desc" className="viejas-nuevas">
            Nuevas a Viejas
          </option>
        </select>
      </label>
      <ul className={`tareas-lista ${isVisible ? "active" : ""}`}>
        {filteredAndSortedTasks.map((task, index) => (
          <li key={index}>
            <h4>{task.titulo}</h4>
            <p>{task.descripcion}</p>
            <button
              onClick={() => handleToggleComplete(task.id, task.completado)}
              className="completar"
            >
              {task.completado
                ? "Marcar como incompleta"
                : "Marcar como completa"}
            </button>
            <button
              onClick={() =>
                (window.location.href = `http://127.0.0.1:8000/aplicacion/api/tareas/${task.id}`)
              }
              className="editar"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="eliminar"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;