export class Storage {
  static storeTask(todo) {
    localStorage.setItem("todo", JSON.stringify(todo));
  }
  static getStoredTask() {
    const item = JSON.parse(localStorage.getItem("todo")) || [];
    return item;
  }

  static removeTask() {
    localStorage.removeItem("todo");
  }
  static storeProject(project) {
    localStorage.setItem("project", JSON.stringify(project));
  }
  static getStoredProject() {
    const item = JSON.parse(localStorage.getItem("project"));
    return item;
  }
  static removeProject() {
    localStorage.removeItem("project");
  }
  static clear() {
    localStorage.clear();
  }
}
