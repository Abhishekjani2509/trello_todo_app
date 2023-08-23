import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todo, setTodo] = useState([]);
  const [progress, setProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInprogress = tasks.filter((task) => task.status === "progress");
    const fclosed = tasks.filter((task) => task.status === "closed");

    setTodo(fTodos);
    setProgress(fInprogress);
    setClosed(fclosed);
  }, [tasks]);

  const statuses = ["todo", "progress", "closed"];

  return (
    <div className="flex gap-20">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todo={todo}
          progress={progress}
          closed={closed}
        />
      ))}
    </div>
  );
};
export default ListTasks;

const Section = ({ status, tasks, setTasks, todo, progress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemtoSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "todo";
  let bg = "bg-slate-500";
  let taskstomap = todo;

  if (status === "progress") {
    text = "In Progress";
    bg = "bg-purple-500";
    taskstomap = progress;
  }
  if (status === "closed") {
    text = "Closed";
    bg = "bg-green-500";
    taskstomap = closed;
  }

  const addItemtoSection = (id) => {
    console.log("dropped", id, status);
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(mTasks));
      toast("Task status changed");
      return mTasks;
    });
  };

  return (
    <div ref={drop} className={`w-60`}>
      <Header text={text} bg={bg} count={taskstomap.length} />
      {taskstomap.length > 0 &&
        taskstomap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-white`}
    >
      {text}
      <div className="ml-3 text-black bg-white w-5 h-5 rounded-full flex justify-center">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // console.log(isDragging)

  const handleRemove = (id) => {
    // console.log(id);
    const ftask = tasks.filter((t) => t.id !== id);
    setTasks(ftask);
    localStorage.setItem("tasks", JSON.stringify(ftask));
    toast("Task Removed");
  };
  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${
        isDragging ? "opacity-25" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <button
        className="absolute bottom-3 right-1 "
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};
