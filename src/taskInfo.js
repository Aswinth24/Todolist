export class TaskInfo {
  constructor(taskTitle, projectTitle, description, priority, date) {
    this.taskTitle = taskTitle;
    this.projectTitle = projectTitle;
    this.description = description;
    this.priority = priority;
    this.date = date;
  }
  getTaskTitle = () => {
    return this.taskTitle;
  };
  getProjectTitle = () => {
    return this.projectTitle;
  };
  getDescription = () => {
    return this.description;
  };
  getPriority = () => {
    return this.priority;
  };
  getDate = () => {
    return this.date;
  };
  setTaskTitle = (taskTitle) => {
    this.taskTitle = taskTitle;
  };
  setProjectTitle = (projectTitle) => {
    this.projectTitle = projectTitle;
  };
  setDescription = (description) => {
    this.description = description;
  };
  setPriority = (priority) => {
    this.priority = priority;
  };
  setDate = (date) => {
    this.date = date;
  };
}
