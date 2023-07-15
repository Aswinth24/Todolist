export class Project {
  constructor(projectTitle, totalTask) {
    this.projectTitle = projectTitle;
    this.totalTask = totalTask;
  }
  getProjectTitle = () => {
    return this.projectTitle;
  };
  getTotalTask = () => {
    return this.totalTask;
  };
  setTotalTask = (count) => {
    this.totalTask = count;
  };
  setProjectTitle = (title) => {
    this.projectTitle = title;
  };
}
