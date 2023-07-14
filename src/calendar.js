
function loadCalendar()
{
    
    const calendarDays=document.querySelector('#calendar-days');
    const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month_picker=document.querySelector('#month-picker');
    const month_list=document.querySelector('.month-list');
    const month_body=document.querySelector('.month-body');
    let cur_day=new Date();
    let cur_month=cur_day.getMonth();
    let cur_year=cur_day.getFullYear();

const isLeapYear=(year)=>
 {
    return (year%400==0||year%4==0&&year%100!=0);   
 }
const getFebDay=(year)=>
 {
    if(isLeapYear(year))return 29;
    return 28;
 }

const generateCalendarDays=(new_date)=>
{
    
    const year=document.querySelector('.year');
    year.textContent=new_date.getFullYear();
    month_picker.textContent=month_names[new_date.getMonth()]+" "+new_date.getFullYear();
    let weekDay=new_date.getDay();
    calendarDays.innerHTML=""; 
    const monthTotalDays=[31, getFebDay(new_date.getFullYear()),31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for(let i=1;i<=monthTotalDays[new_date.getMonth()]+weekDay;i++)
    {
        const days=document.createElement('div');
        
        calendarDays.appendChild(days);
        if(i>weekDay){
            days.classList.add('day');
            const day=Math.floor(i%7);
            days.setAttribute('data-day',`${day==0?7:day}`);
            days.setAttribute('data-month',`${cur_month}`);
            days.setAttribute('data-year',`${cur_year}`);
            days.textContent=i-weekDay;   
        }
    }
}

month_picker.addEventListener('click',()=>{
    month_body.classList.add('show');
    generateMonths();
});
document.querySelector("#prev-year").addEventListener('click',()=>{
    --cur_year;
    generateCalendarDays(new Date(cur_year,cur_month));
});

document.querySelector("#next-year").addEventListener('click',()=>{
    ++cur_year;
    generateCalendarDays(new Date(cur_year,cur_month));
});
document.querySelector("#prev-year-picker").addEventListener('click',()=>{
    if(cur_month==0)
    {
        cur_month=11;
        --cur_year;
    }
    else{
        --cur_month;
    }
    generateCalendarDays(new Date(cur_year,cur_month));
});

document.querySelector("#next-year-picker").addEventListener('click',()=>{
    if(cur_month==11)
    {
        cur_month=0;
        ++cur_year;
    }
    else{
        ++cur_month;
    }
    generateCalendarDays(new Date(cur_year,cur_month));
});
const generateMonths=()=>{
    
    month_list.innerHTML="";
    for(let i=0;i<month_names.length;i++)
    {
        const div=document.createElement('div');
        const span=document.createElement('span');
        span.textContent=month_names[i];
        div.appendChild(span);
        month_list.appendChild(div);
        span.addEventListener('click',()=>
        {
            month_body.classList.remove('show');
            generateCalendarDays(new Date(cur_year,i));
        });
    }
}


generateCalendarDays(new Date(cur_year,cur_month));

}
export {loadCalendar};