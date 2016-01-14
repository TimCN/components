;(function(g){





  //载入样式
  (function(){

    var currentDirectory = document.scripts[document.scripts.length-1].src.substring(0,document.scripts[document.scripts.length-1].src.lastIndexOf("/")+1);
    var header = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.setAttribute('rel','stylesheet');
    style.setAttribute('type','text/css');
    style.setAttribute('href',currentDirectory + 'calendar.css');
    header.appendChild(style);
  })();

  var monthTHID = "monthTH" + Math.ceil(Math.random()*10000);

  var monthPrefix  = "monthcell_";
  var monthTHClass = "calendarMonthCell"
  var monthTHActiveClass = "calendarMonthTHActive";

  var currentDate  = new Date().getDate();
  var  startDate,
         endDate;

  var MONTH = new Array(
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  )


  function monthClick(monthId){

    var nodes = document.getElementById(monthTHID).childNodes;
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].nodeType !=1){
        continue;
      }
      if(nodes[i].getAttribute("id")== monthId){
        nodes[i].setAttribute("class", monthTHClass+ " " + monthTHActiveClass)

      } else {
        nodes[i].setAttribute("class", monthTHClass)
      }
    }
    setDates(monthId.split("_")[1],monthId.split("_")[2])
  }

  function setDates(year,month){
    currentDate = new Date(year, month, 1);
    var html = calcDate();
    document.getElementById("calendarDateRow").innerHTML = html;
  }

  function calcDate(){
    //currentDate
    var beginDate = 1;//currentDate.getDate();
    var endDate   = getMaxDateInMonth(currentDate);

    //用于记录第一天和最后天的padding样式
    var offsetDays = {};

    //第一天
    var offsetDay = new Date(currentDate.getFullYear(),currentDate.getMonth(),1).getDay()-1;
    if(offsetDay < 0){
      offsetDay = 7 + offsetDay;
    }
    offsetDays[beginDate] = ' style="padding-left:'+(offsetDay*14.285)+'%;"';

    //最后一天
    offsetDay = endDate.getDay() > 0 ? endDate.getDay() : 7;
    offsetDays[endDate.getDate()]=' style="padding-right:'+((7-offsetDay)*14.285)+'%;"';
    var html ="";

    //最后一个星期的第一天
    var lastWeekFirstDate = endDate.getDate() - offsetDay;

    while (beginDate <= endDate.getDate()) {

      var attrStr = 'class="calendarDateCell"';

      //最后一周   请勿调整其和最后一天的顺序
      if(beginDate >lastWeekFirstDate){
        attrStr = 'class="LastCalendarDateCell calendarDateCell"';
      }

      //第一天/最后一天
      if(beginDate == 1||beginDate == endDate.getDate()){
        attrStr += offsetDays[beginDate];
      }


      html  +='<div ' + attrStr + '>'
            +'   <p>'
            +     beginDate
            +'  </p>'
            +' </div>';

      //最后一周把分割线去掉


      beginDate++;
    }

    return html;
  }

  function AppendMonthActiveClass (domID) {
    var node = document.getElementById(domID);
    var klass = node.getAttribute("class") + " " + monthActiveClass;
    node.setAttribute("class",klass);
  }



  function installer(id,beginDate,finishDate){

     //debugger;
    startDate = new Date(beginDate);
    endDate = new Date(finishDate);
    if(startDate == "Invalid Date"|| endDate =="Invalid Date"){
      return;
    }

    //init currentMonth
    if(currentDate>endDate || currentDate<startDate){
      currentDate = startDate;
    }




    var tableBegin            = '<div class="calendarTable">';
    var monthTHBegin          = '  <div id="'+monthTHID+'" class="calendarMonthTH">';
    var monthCellsHTML        = '';
    var monthTHEnd            = '  </div>';
    var dayTHHTML             = `  <div class="calendarDayTH">
                                       <div class="calendarDayCell">
                                           <p>
                                             一
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             二
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             三
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             四
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             五
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             六
                                           </p>
                                       </div>
                                       <div class="calendarDayCell">
                                           <p>
                                             日
                                           </p>
                                       </div>
                                   </div>`;
    var dateRowHTML           = '';
    var tableEnd              = '</div>';



    //月份计算,可能跨年
    var showMonth  = new Date(startDate.getFullYear(),startDate.getMonth(),1);
    while (showMonth <= endDate) {

      var tempClass = monthTHClass;
      if(currentDate.getFullYear() == showMonth.getFullYear() && currentDate.getMonth() == showMonth.getMonth()){
        tempClass +=" " + monthTHActiveClass;
      }
      var mid = monthPrefix + showMonth.getFullYear()+ "_" + showMonth.getMonth();

      //最后一个月无margin-right
      if(showMonth.getFullYear() == endDate.getFullYear() && showMonth.getMonth() == endDate.getMonth()){
        tempClass= "lastCalendarDayCell " + tempClass;
      }
      monthCellsHTML += '<div id="' + mid + '" class="' + tempClass + '" onclick="window.calendar.onMonthClick(\'' + mid + '\')">'
                      + '   <p>' + MONTH[showMonth.getMonth()] + '</p>'
                      + '</div>';

      showMonth= new Date(showMonth.getFullYear(),showMonth.getMonth()+1,1);
    }

    showMonth = null;

    //计算日期
    dateRowHTML = calcDate();
    dateRowHTML ='<div id="calendarDateRow">'
                +  dateRowHTML
                +'</div>';
    document.getElementById(id).innerHTML  = tableBegin
                                           + monthTHBegin
                                           + monthCellsHTML
                                           + monthTHEnd
                                           + dayTHHTML
                                           + dateRowHTML
                                           + tableEnd ;
  }

  function getMaxDateInMonth(date){
    var nextMonth = new Date(date.getFullYear(),date.getMonth()+1,1);
    return new Date(nextMonth - 24*60*60*1000);
  }






  g.calendar={
         install:installer,
    onMonthClick:monthClick
  }
})(window||global)
