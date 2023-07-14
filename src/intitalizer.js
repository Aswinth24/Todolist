import { weeksToDays } from 'date-fns/esm';
import {loadCalendar} from './calendar';
import {TaskInfo} from './taskInfo.js';
import { compareAsc, format } from 'date-fns';
import {Storage} from './storage.js';
import { Project } from './projects';
let taskDetials;
let projects=[];



const overlayContainer=document.querySelector('.overlay-body');
const popConatiner=document.querySelector('#pop-pop-container'); 
 
const heading=document.querySelector('#heading');
const editTaskTitle=document.querySelector('#add-project-task-title-1');
const editTitle=document.querySelector('#title-area');
const description=document.querySelector('#description-area');
const  editDueDate=document.querySelector('#due-date-1');
const editTaskPriority=document.querySelector("#add-new-priority-1");
const editCancel=document.querySelector('#edit_Task_cancel');

const editTask=document.querySelector('#edit-form');
const newTaskSave=document.querySelector('#save-new-task')

const listContainer=document.querySelector('#list-of-Content');
const inboxList=document.querySelector('#inbox');
const todayList=document.querySelector('#today');
const weekList=document.querySelector('#week');
const notesList=document.querySelector('#note');
const projectheading=document.getElementById('project-heading');
const projectAddBtn=document.querySelector('#project-add-btn');
const projectAddTitle=document.querySelector('#project-add-title');
let currentActive=inboxList;

const cancelProjectTitle=document.querySelector('#cancel-project-title');
const saveProjectTitle=document.querySelector('#save-project-title');
const inputProjectTitle=document.querySelector('#input-project-title');
//const deleteProject=document.querySelector('#delete_project');
const priorityPop=document.querySelector('#priority-pop-pop');
const projectSelection=document.querySelector('#project_title_pop_pop_container');

const calendarContainer=document.querySelector('.calendar-container');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
const load=()=>{

  updateTotalTask();
  createTaskInbox();
  inboxList.classList.add('active');
}
const addProjectTitle=(title,count)=>{
  const project=new Project(title,count)
  projects.push(project);
}
const storeTaskLists=()=>{
    Storage.removeTask();
    Storage.storeTask(taskDetials);
}
const storeProjects=()=>{
   Storage.removeProject();    
   Storage.storeProject(projects);
}
function start()
{
   taskDetials=[];
   projects=[];
   const temp=Storage.getStoredTask();
   if(temp==null||temp==='undefined')
   {
    createTaskObject('Welcome','Inbox','Access free feature',getTodayDateFormat(new Date()),'Easy');
    storeTaskLists();
   }
   else
   {
      temp.forEach(element => {
        taskDetials.push(Object.assign(new TaskInfo(),element));
      });
  }
   const temp1=Storage.getStoredProject();
   if(temp1===null||temp1==='undefined')
   {
     projects.push(new Project('My Work 🎯',0));
     storeProjects();
   }
   else
   {
    temp1.forEach(element => {
      projects.push(Object.assign(new Project(),element));
    });
   }
  load();
  initialize();
  
}

function initialize()
{
 
  console.log(taskDetials);
  console.log(projects);
  
  
  const menuNavBar=document.querySelector('#menu-bar');
  const addNewTask=document.querySelector('#add-new-task');
  const deleteBtn=document.querySelector('#delete');

  menuNavBar.addEventListener('click',addAndRemoveMenuNavBar);  
  deleteBtn.addEventListener('click',()=>{
    editTask.classList.remove('active');
    hideContainer();
  });
  addNewTask.addEventListener('click',()=>{
    newTaskContainer();
  });
  document.addEventListener('click',(e)=>
  {
   
    if(e.target.matches('.edit-btn'))
    {
       const i=e.target.getAttribute('data-index');  
       editTaskContainer(i);
      
    }
    else if(e.target.matches('.delete-btn'))
    {
    //  console.log(e.target.getAttribute('data-index'));
      DeleteTask(e.target.getAttribute('data-index'));
    }
    else if(e.target.matches('.title')||e.target.matches('.project-title'))
    {
          
           let index=0;
           if(e.target.matches('.title'))
           {
             index=e.target.parentNode.getAttribute('data-index');
            // console.log("child"+index);
             createProjectTask(index);
           }
           else{
            index=e.target.getAttribute('data-index');
            //console.log("parent"+index);
            createProjectTask(index);
           }
           addActiveToProjectTask('.project-title',index);
    } 
    else if(e.target.matches('.checkbox'))
    {
      DeleteTask(e.target.getAttribute('data-index'));
    }
    else if(e.target.matches('.day'))
    {
      generateDate(e.target.getAttribute('data-year'),e.target.getAttribute('data-month'),e.target.textContent);
      calendarContainer.classList.remove('active');    
    }
    else if(e.target.matches('.delete_project'))
    {
      workingOfDeleteProject(e.target.getAttribute('data-index'));
    }


  });
  inbox.addEventListener('click',()=>{
    currentActive.classList.remove('active');
    currentActive=inboxList;
    createTaskInbox();
    inbox.classList.add('active');
  });
  todayList.addEventListener('click',()=>{
    currentActive.classList.remove('active');
    currentActive=todayList;
    createTodayTask();
    todayList.classList.add('active');
    
  });
   weekList.addEventListener('click',()=>{
       currentActive.classList.remove('active');
       currentActive=weekList;
       createWeeklyTask();
       weekList.classList.add('active');
       
   })
  
  projectAddBtn.addEventListener('click',()=>{
          showContainer();
          projectAddTitle.classList.add('active');
  })
  const removeProjectTitleBox=()=>{
    inputProjectTitle.value='';
    projectAddTitle.classList.remove('active');
    hideContainer();
}
  cancelProjectTitle.addEventListener('click',removeProjectTitleBox);
  
  function findtitle(title){
    for(let i=0;i<projects.length;i++)
    {
      if(projects[i].getProjectTitle()==title){
        return true;
      }
    }
    return false;
  }
  saveProjectTitle.addEventListener('click',()=>
  {
      // e.stopImmediatePropagation();
       const projectTitle=inputProjectTitle.value;
       const error_message=document.querySelector('#error-message')
       //console.log(projects);
       error_message.innerHTML='';
       if(projectTitle.length==0)
       {
        error_message.textContent='* Title field is Reqired'
       }
       else if(findtitle(projectTitle))
       {
        error_message.textContent='*Title Already Exit'
       }
       else{
          addProjectTitle(projectTitle,0);
          storeProjects();
          createProjectTitleList();
          storeProjects();
          removeProjectTitleBox();
       }
  })
 const addActiveToProjectTask=(className,index)=>
 {
      const totalList=document.querySelectorAll(className);      
      currentActive.classList.remove('active');
      currentActive=totalList[index];
      //console.log(totalList[index]);
      currentActive.classList.add('active');
      
 }
  const createProjectTitleList=()=>
  {
    const projectContent=document.querySelector('#project-list-content');
    projectContent.innerHTML='';
      for(let i=0;i<projects.length;i++)
      {
        const list=document.createElement('li');
        list.classList.add('project-title');
        list.setAttribute('data-index',`${i}`);

        const p=document.createElement('p');
        p.classList.add('title')
        p.textContent=projects[i].getProjectTitle();

        const span=document.createElement('span');
        span.setAttribute('id',`${i}`);
        span.textContent=projects[i].getTotalTask();
        

        const iTag=document.createElement('i');
        iTag.classList.add('fa-solid');
        iTag.classList.add('fa-xmark');
        iTag.classList.add('delete_project');
        iTag.setAttribute('data-index',`${i}`);

        list.appendChild(p);
        list.appendChild(span);
        list.appendChild(iTag);

        projectContent.appendChild(list);
      }
  }
  const projectDiscardPopPop=document.querySelector('.pop_pop_notification_for_project_discard');
  const workingOfDeleteProject=(index)=>
  {
     //const index=e.target.getAttribute('data-index');
     document.querySelector('#project_title_to_delete').textContent=projects[index].projectTitle+" ?";
     projectDiscardPopPop.classList.add('active');
     overlayContainer.classList.add('visible');
    
  
  const closeProjectDiscardPopPop=()=>{
    projectDiscardPopPop.classList.remove('active');
    checkMenuBarOpen();
  }
 
  document.querySelector('#cancel_project').addEventListener('click',closeProjectDiscardPopPop);
  document.querySelector('#discard_project').addEventListener('click',()=>
  {
     const temp=[];
     for(let i=0;i<taskDetials.length;i++)
     {
       if(projects[index].projectTitle!==taskDetials[i].getProjectTitle())
       {
           temp.push(taskDetials[i]);
       }
     }
     taskDetials=temp;
     projects.splice(index,1);
     
     currentActive=inboxList;
     inbox.classList.add('active');

     createProjectTitleList();
     createTask();
     storeTaskLists();
     storeProjects();
     closeProjectDiscardPopPop();
  })
}
   //-------------------------


   //--------------------
}

    
   //+++++++++++++++ Date Format +++++++++++++++++++++///
   const generateDate=(year,month,date)=>{
     // console.log(year+" "+month+" "+date);
        const today=new Date();
        const curDay=new Date(year,month,date);
        let curDate=getTodayDateFormat(today);
        if(curDay.getFullYear()>=today.getFullYear()&&curDay.getMonth()>=today.getMonth()&&curDay.getDate()>=today.getDate())
         { 
          curDate=getTodayDateFormat(curDay);
         }
         if(newTaskForm.classList.contains('active'))
            {
              newTaskDueDate.textContent=curDate;
              //projectSelection.classList.remove('active'); 
            }
            else if(editTask.classList.contains('active'))
            {
               editDueDate.textContent=curDate;
              // priorityPop.classList.remove('active'); 
            }    

   }
   const getTodayDateFormat=(date)=>{
      const {format} = require('date-fns');
      const today =format(date,'dd-MM-yyyy');
      return today;
   }
    
   const createTaskObject=(titleContent,projectTitle,descriptionContent,priority,dueDate)=>
   { 
      const taskInfo=new TaskInfo(titleContent,projectTitle,descriptionContent,priority,dueDate);
      taskDetials.push(taskInfo);
   }
   const showContainer=()=>
   {   
    popConatiner.classList.add('visible');
    overlayContainer.classList.add('visible');
   }
  const hideContainer=()=>{
    popConatiner.classList.remove('visible');
    checkMenuBarOpen();
  }
   const checkMenuBarOpen=()=>{
    if(document.querySelector('.nav').classList.contains('active')==false)
        overlayContainer.classList.remove('visible');

   }
  const addAndRemoveMenuNavBar=()=>
   {
    document.querySelector('.nav').classList.toggle('active');
    document.querySelector('.view-content').classList.toggle('active');
   // console.log(window.innerWidth=='900');
   if(window.innerWidth<='900')
    {
      overlayContainer.classList.toggle('visible');
      document.querySelector('.header').classList.toggle('active');
    }
   }

//++++++++++++++++++++ Add New Task Form ++++++++++++++++++++++++++//
  
   const newTaskForm=document.querySelector('#new-task-container');
   const cancelNewTaskForm=document.querySelector('#cancel-new-task');
 
   const newTaskTitle=document.querySelector("#new-task-title");
   const newTaskProjectTitle=document.querySelector("#add-project-task-title");
   const newTaskDescription=document.querySelector("#new-task-description");
   const newTaskPriority=document.querySelector("#add-new-priority");

   const newTaskDueDate=document.querySelector("#due-date");

   const taskTitleSelectionList=document.querySelector('#project-task-title-list');

   document.querySelector('.for-Inbox').addEventListener('click',()=>{
    if(newTaskForm.classList.contains('active'))
    {
      
      setProjectTaskTitle('Inbox')
     // projectSelection.classList.remove('active'); 
    }
    else if(editTask.classList.contains('active'))
    {
       setEditTaskTitleOption('Inbox');
       //projectSelection.classList.remove('active'); 
    }
   })
   const createTitleOption=()=>
   {
      taskTitleSelectionList.innerHTML='';
      for(let i=0;i<projects.length;i++)
      {
        const div=document.createElement('div');
        div.classList.add('project-task-container');

        const span=document.createElement('span');
        span.classList.add('dot');

        const span1=document.createElement('span');
        span1.classList.add('project-task-title');
        span1.textContent=projects[i].getProjectTitle();

        div.appendChild(span);
        div.appendChild(span1); 
         div.addEventListener('click',()=>
         {
            const temp=projects[i].getProjectTitle();
            if(newTaskForm.classList.contains('active'))
            {
            
              setProjectTaskTitle(temp)
             projectSelection.classList.remove('active'); 
            }
            else if(editTask.classList.contains('active'))
            {
               setEditTaskTitleOption(temp);
               projectSelection.classList.remove('active'); 
            }
         });
        taskTitleSelectionList.appendChild(div);
      }
   }
   const createPriorityOption=()=>{
    const priority=['Easy','Medium','Important'];
    const div=document.querySelector('#priority-pop-pop');
    div.innerHTML='';
    for(let i=0;i<priority.length;i++)
    {
       const span=document.createElement('span');
       span.textContent=priority[i];

       span.addEventListener('click',()=>{
        if(newTaskForm.classList.contains('active'))
        {
          setAddPriorityOption(priority[i]);
          priorityPop.classList.remove('active'); 
        }
        else if(editTask.classList.contains('active'))
        {
           setEditPriorityOption(priority[i]);
           priorityPop.classList.remove('active'); 
        }
       });
      div.appendChild(span);
    }  
   }
   const setAddPriorityOption=(priority)=>{
    //console.log(priority);
    newTaskPriority.textContent=priority;
   }
   const setProjectTaskTitle=(title)=>{
    //console.log(title);
    newTaskProjectTitle.textContent=title;
   }
  const setEditPriorityOption=(priority)=>{
          editTaskPriority.textContent=priority;
  }
  const setEditTaskTitleOption=(title)=>{
      editTaskTitle.textContent=title;
  }

  const addNewTaskInitialise=()=>{
   const today=new Date();
    newTaskTitle.value='';
    newTaskDescription.value='';
    newTaskPriority.textContent='Easy'
    newTaskProjectTitle.textContent='Inbox';
    newTaskDueDate.textContent=getTodayDateFormat(today);
   // console.log('dude'+newTaskDueDate.textContent);
  }
   const newTaskContainer=()=>
   {
       addNewTaskInitialise();
       showContainer();
       newTaskForm.classList.add('active'); 
       newTaskFormFunction();
  }
  const newTaskFormFunction=()=>
  {
    let today=new Date();

    newTaskDueDate.textContent=getTodayDateFormat(today); 

     //----------------- Due Date function --------------------//
      newTaskDueDate.addEventListener('click',()=>
        {  
           if(!priorityPop.classList.contains('active')&&!projectSelection.classList.contains('active'))
           {     
              calendarContainer.classList.toggle('active');    
              
               loadCalendar();
           } 
        });
        newTaskDueDate.addEventListener('click',(e)=>
        {  
              e.stopImmediatePropagation();
        })
        

      //----------------------------------------------------------//
     newTaskPriority.addEventListener('click',()=>
     {
          if(!calendarContainer.classList.contains('active')&&!projectSelection.classList.contains('active')){
                priorityPop.classList.toggle('active');
                createPriorityOption();
          }  
         
     });
     newTaskPriority.addEventListener('click',(e)=>
     {
          
      e.stopImmediatePropagation();
     });
     
    
     //----------------------------------------------------------//

    //----------------- Project Title function --------------------//
      
    newTaskProjectTitle.addEventListener('click',()=>
     {
      if(!calendarContainer.classList.contains('active')&&!priorityPop.classList.contains('active')){
            projectSelection.classList.toggle('active');
            
              createTitleOption();
      }
     
     });
     newTaskProjectTitle.addEventListener('click',(e)=>
     {     
          e.stopImmediatePropagation();
     });
   
   
      //----------------------------------------------------------//


        newTaskForm.addEventListener('submit',(e)=>
        {
          e.stopImmediatePropagation();
          e.preventDefault();
          //console.log("createform"+newTaskDueDate.textContent);
          createTaskObject(newTaskTitle.value,newTaskProjectTitle.textContent,newTaskDescription.value,newTaskPriority.textContent,newTaskDueDate.textContent);
          updateTotalTask();
          createTask();
          storeTaskLists();
        
          storeTaskLists();
          hideContainer();
          newTaskForm.classList.remove('active');   
        });
        
  }

  cancelNewTaskForm.addEventListener('click',()=>{
    addNewTaskInitialise();
    hideContainer()
    newTaskForm.classList.remove('active'); 
  });
  editCancel.addEventListener('click',()=>{
    hideContainer()
    editTask.classList.remove('active'); 
  }); 

  
  const createTask=()=>{
        if(currentActive===inboxList)
        {
         createTaskInbox();
        }
        else if(currentActive===todayList)
        {
          createTodayTask();
        }
        else if(currentActive===weekList)
        {
          createWeeklyTask();
        }
        else{
          createProjectTask(currentActive.getAttribute('data-index'));
        }
     
       
  }
  const updateTotalTask=()=>
  {
    //Inbox
  
    document.getElementById('total-inbox-task').textContent=taskDetials.length;
    // Today
    const todayDate=getTodayDateFormat(new Date());
    let count=0;
    for(let i=0;i<taskDetials.length;i++)
    {
      console.log(taskDetials);
      if(taskDetials[i].getDate()==todayDate)
      {
        count++;
      }
    }
    document.getElementById('total-today-task').textContent=count;

    //weekly
    
  const week=weekDays();
  //console.log(week);
  //console.log(taskDetials);
  count=0;
  for(let i=0;i<taskDetials.length;i++)
  {
    if(week.includes(taskDetials[i].getDate()))
    {
      count++;
    }
   }
  document.getElementById('total-weekly-task').textContent=count;

  //console.log(projects);
  for(let i=0;i<projects.length;i++)
  {
    count=0;
    for(let j=0;j<taskDetials.length;j++)
    {
      if(taskDetials[j].getProjectTitle()===projects[i].getProjectTitle())
      {
        count++;   
      }
    }
    projects[i].setTotalTask(count);
    document.getElementById(`${i}`).textContent=projects[i].getTotalTask();
  }
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++++++//
  const DeleteTask=(index)=>{
          taskDetials.splice(index,1);
          createTask();
          storeTaskLists();
          updateTotalTask();
  }
  //++++++++++++++++++ Edit Task contaner ++++++++++++++++++++++++++//

  const updateEditedTask=(index)=>{
    taskDetials[index].taskTitle= editTitle.value;
    taskDetials[index].projectTitle=editTaskTitle.textContent;
    taskDetials[index].description= description.value;
    taskDetials[index].priority=editTaskPriority.textContent;
    taskDetials[index].date=editDueDate.textContent;
   }
   
  const findCurrentContent=(index)=>{
   
   heading.textContent=taskDetials[index].getProjectTitle();
   editTitle.value=taskDetials[index].getTaskTitle();
   editTaskTitle.textContent=taskDetials[index].getProjectTitle();
   description.value=taskDetials[index].getDescription();
   editDueDate.textContent=taskDetials[index].getDate();
   editTaskPriority.textContent=taskDetials[index].getPriority();
 
 }
  let icount=0;
  let index_1=0;
  const editTaskContainer=(index)=>{ 
    icount=0;
    findCurrentContent(index);
    showContainer();
    editTask.classList.add('active'); 
    if(icount===0)
    {
      index_1=index;
    }
    editTaskFunction(); 
  }
  
  const editTaskFunction=()=>
  { 
    icount++;
    //----------------- Due Date function --------------------//
    editDueDate.addEventListener('click',()=>
    {       
      if(!priorityPop.classList.contains('active')&&!projectSelection.classList.contains('active'))
      {     
         calendarContainer.classList.toggle('active');    
          loadCalendar();
      }
     
    });
    editDueDate.addEventListener('click',(e)=>
    {     
         e.stopImmediatePropagation(); 
    });
    popConatiner.addEventListener('click',()=>{
      calendarContainer.classList.remove('active');    
    })
   
 //----------------------------------------------------------//
     //----------------- Priority function --------------------//
      
     editTaskPriority.addEventListener('click',()=>
     {
      if(!calendarContainer.classList.contains('active')&&!projectSelection.classList.contains('active')){
        priorityPop.classList.toggle('active');
       
        createPriorityOption();
        }
     
     });  
     editTaskPriority.addEventListener('click',(e)=>
     {     
          e.stopImmediatePropagation(); 
     });
     popConatiner.addEventListener('click',()=>{
      priorityPop.classList.remove('active');    
    })
    
     //----------------------------------------------------------//

     editTaskTitle.addEventListener('click',()=>
     {
      if(!calendarContainer.classList.contains('active')&&!priorityPop.classList.contains('active')){
        projectSelection.classList.toggle('active');
        
          createTitleOption();
     }
    });
    editTaskTitle.addEventListener('click',(e)=>
    {     
         e.stopImmediatePropagation();
    });
    popConatiner.addEventListener('click',()=>{
      projectSelection.classList.remove('active');    
    })
   
    editTask.addEventListener('submit',(e)=>
    {
     
      e.preventDefault();
      e.stopImmediatePropagation();
      updateEditedTask(index_1);
      createTask();
      updateTotalTask();
      storeTaskLists();
      hideContainer();
      editTask.classList.remove('active');
     
    });
   
     

     
   
}
//+++ +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  const createToDoList=(i)=>
    {   
       const task=document.createElement('div');
      task.classList.add('task-container');
          task.innerHTML=
          ` 
         <div class="checkbox-container">
             <input type="checkbox" class="checkbox" id="checkbox-${i}" data-index="${i}">
             <label class="checkmark" for="checkbox-${i}" data-index="${i}"></label>
         </div>
         <div class="task-box">
             <div class="task-content">
                 <div class="content-box">
                     <p id="task-title">
                       ${taskDetials[i].getTaskTitle()}
                     </p>
                 </div>
                 <div class="description">
                     <p id="des-content">
                     ${taskDetials[i].getDescription()}
                     </p>
                 </div>
             </div>
                <div class="options">
                    <div class="due-date-text">
                      <span>${taskDetials[i].getDate()}</span>
                    </div>
                   <div class="content-priority" style='background-color:${colorFind(taskDetials[i].getPriority())}'>
                      <span>${taskDetials[i].getPriority()}</span>
                    </div>
                </div>
         </div>
         <div class="task-option">
          <i class="fa-solid fa-pen-to-square option-icon edit-btn" data-index="${i}"></i>
          <i class="fa-regular fa-trash-can option-icon delete-btn" data-index="${i}"></i>
         </div>
         `;
         return task;

} 

const colorFind=(priority)=>{
    const color=['var(--color1)','var(--color2)','var(--color3)'];
    if(priority==='Easy')
    {
      return color[1];
    }
    else if(priority==='Medium')
    {
      return color[0];
    }
    else{
      return color[2];
    }
}

const createTaskInbox=()=>{
  listContainer.innerHTML='';
  projectheading.textContent='Inbox';
  document.getElementById('total-inbox-task').textContent=taskDetials.length;
  for(let i=0;i<taskDetials.length;i++)
  {
    listContainer.appendChild(createToDoList(i));
  }
}
const createTodayTask=()=>
{
  projectheading.textContent='Toady';
  listContainer.innerHTML='';
  const todayDate=getTodayDateFormat(new Date());
  let count=0;
  for(let i=0;i<taskDetials.length;i++)
  {
    if(taskDetials[i].getDate()==todayDate)
    {
      listContainer.appendChild(createToDoList(i));
      count++;
    }
  }
  document.getElementById('total-today-task').textContent=count;
}
const weekDays=()=>{
  const temptoday=new Date();
  let day=temptoday.getDay();
  const month=temptoday.getMonth();
  const year=temptoday.getFullYear();
  let date=temptoday.getDate();
  const week=[];
  for(let i=0;i<7;i++)
  {
      if(day>6)
      {
         break;
      }  
      day++;
      week.push(getTodayDateFormat(new Date(year,month,date++)));
  }
  return week;
}

const createWeeklyTask=()=>
{
  projectheading.textContent='Weekly';
  listContainer.innerHTML='';

  const week=weekDays();
  let count=0;
  for(let i=0;i<taskDetials.length;i++)
  {
    if(week.includes(taskDetials[i].getDate()))
    {
      listContainer.appendChild(createToDoList(i));
      count++;
    }
  }
  document.getElementById('total-weekly-task').textContent=count;
}
const createProjectTask=(index)=>
{
  listContainer.innerHTML='';
  projectheading.textContent=projects[index].projectTitle;
  let count=0;
 // console.log(taskDetials);
  for(let i=0;i<taskDetials.length;i++)
  {
    if(projects[index].projectTitle===taskDetials[i].getProjectTitle())
    {
      listContainer.appendChild(createToDoList(i));
      count++;
    }
  }
  projects[index].totalTask=count;
  document.getElementById(index).textContent=count;
}


export default start;