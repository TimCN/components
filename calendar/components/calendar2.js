;(function(g){



  //常量

  //月份字典（用于月份头显示）    如 一月为 0 其对应的 MONTH[0]: "1月"
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
  );

  var WEEKHEADERS = new Array(
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日"
  );
  //星期枚举 (用于计算)  如星期日   为 WEEK[0]:7
  var WEEK = new Array(
    7,
    1,
    2,
    3,
    4,
    5,
    6
  );


  //记录需要特殊处理的日子，这里用于记录赛事日子
  var SPECIAL_DATES={};
  var monthPrefix  = "monthCell" + Math.ceil(Math.random()*10000);
  var width,height;
  var monthTHClass="calendarMonthCell",
      monthTHActiveClass="calendarMonthTHActive";
  var dateContainerID = "calendarDateContainer";



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






  /* 动态创建月份头部，区间是[fromMonth,toMonth]
   * @param {Date} fromMonth 开始的月份
   * @param {Date} toMonth   结束的月份
   * @param {Date} activeMonth 处于被选中的月份
   * @param {string} monthClass 月份元素的样式类
   * @param {string} monthActiveClass 被选中的月份元素的样式类
   * @param {string} monthIdPrefix 月份元素ID的前缀
   * @param {int} monthContainerWidth 月份父元素宽度(单位：px)
   * @param {string} monthContainerClass 月份父元素样式类
   * @return {string} 返回一串html
   */
  function setupMonth (fromMonth, toMonth, activeMonth, monthClass, monthActiveClass, monthIdPrefix, monthContainerWidth,monthContainerHeight) {

    //初始化
    var monthCount = (toMonth.getFullYear()-fromMonth.getFullYear()) * 12 + toMonth.getMonth()-fromMonth.getMonth() + 1;
    var margins = (monthCount-1)*3;
    var monthCellWidth = ( monthContainerWidth - ( ( monthCount -1 ) * 3 ) ) / monthCount;

    if(!activeMonth){
      activeMonth = fromMonth;
    }
    var monthHTML = '  <div id="calendarMonth" style="width:'+monthContainerWidth+'px;height:' + monthContainerHeight + 'px;">';

    var tempClass, monthId, monthStyle;
    for (var i = 0; i < monthCount; i++) {
      tempClass = monthClass;
      monthStyle = 'width:' + monthCellWidth + 'px;height:'+monthContainerHeight+'px;line-height:'+monthContainerHeight+'px;';

      //当前被选中的月份添加样式
      if(activeMonth.getFullYear() == fromMonth.getFullYear() && activeMonth.getMonth() == fromMonth.getMonth()){
        tempClass +=" " + monthActiveClass;
      }

      //最后一个没有margin-right
      if(i==monthCount-1){
        monthStyle+="margin-right:0px;"
      }

      //生成月份元素的id
      monthId = monthIdPrefix + "_" + fromMonth.getFullYear()+ "_" + fromMonth.getMonth();

      monthHTML += '<div id="' + monthId + '" style=' + monthStyle + ' class="' + tempClass + '" onclick="window.calendar.onMonthClick(\'' + monthId + '\')">'
                + MONTH[fromMonth.getMonth()]
                + '</div>';

      fromMonth= new Date(fromMonth.getFullYear(),fromMonth.getMonth()+1,1);
    }
    monthHTML += '</div>';
    return monthHTML;
  }

  /*
   * @return {string} 返回周(头部)的html字符串
   */
  function setupDay (containerWidth,containerHeight,rowClass,rowMarginClass,cellClass) {

    containerWidth = containerWidth - 20;
    var cellWidth  = containerWidth / 7;
    cellWidth = parseInt(cellWidth);
    var innerHTML ='<div class="' + rowClass + '" style="width:'+containerWidth+'px;height:'+(containerHeight-1)+'px;"><div style="height:' + (containerHeight-1) + 'px;width:' + containerWidth + 'px;">';
    var styles = "width:"+cellWidth+"px;height:" + (containerHeight-1) +"px;line-height:"+ (containerHeight-1) +"px;";
    for(var i = 0; i < 7; i++){
      innerHTML +='<div style="' + styles + '" class="' + cellClass + '">'
                 + WEEKHEADERS[i]
                 +' </div>';
    }
    innerHTML +='</div></div>'
    return innerHTML;
  }

  /*
   *@param {Date} date 需要计算的月份日期
   *@return {string} 返回本月所以日期的html字符串
   */
  function setupDate (date,dateContainerWidth,dateContainerHeight,dateClass,rowClass) {
    var innerHTML = '<div id ="'+dateContainerID+'" style="width:'+dateContainerWidth+'px;height:'+dateContainerHeight+'px">';
        innerHTML += getDatesHTML(date,dateContainerWidth,dateContainerHeight,dateClass,rowClass);
        innerHTML += '</div>';

    return innerHTML;
  }
  function getDatesHTML (date,dateContainerWidth,dateContainerHeight,dateClass,rowClass) {
    //计算出单个的高度
    var firstDate = new Date(date.getFullYear(),date.getMonth(),1,2);
    var lastDate  = new Date(date.getFullYear(),date.getMonth()+1,1,2);
        lastDate  = new Date(lastDate.setDate(lastDate.getDate()-1));
    var offsetDates = WEEK[firstDate.getDay()] - 1;
    var lines = Math.ceil((lastDate.getDate() +offsetDates) / 7);

    //日期单位高度
    var dateHeight = (dateContainerHeight-lines + 1) / lines;
    //日期单位宽度
    var dateWidth  = (dateContainerWidth-20-14) / 7;
    dateWidth = parseInt(dateWidth);
    var dateHTML ='',
        rowStyles;
    var currentDate = new Date(date.getFullYear(),date.getMonth(),1);

    //将起始日确定到星期一
    currentDate= new Date(currentDate.setDate(currentDate.getDate()-offsetDates));


    for(var i = 0; i < lines; i++) {

      rowStyles = 'height:' + dateHeight + 'px;width:'+(dateContainerWidth-20)+'px;';

      if(i == lines - 1){

        rowStyles +="border-bottom:none;";

      }

      dateHTML += '<div class="' + rowClass + '" style="' + rowStyles + '">';

      var styles;


      var currentDay = WEEK[currentDate.getDay()];

      for(var j = currentDay; j < 8; j++) {

          styles = "position:relative;width:"+dateWidth+"px;height:" + (dateHeight-4) +"px;line-height:"+ dateHeight +"px;";

          var hoverDivHTML ="";
          var classes = dateClass;
          if(currentDate.getMonth()!=date.getMonth()){

            //不是当前月份的日期
            styles += "background:none;color:#5c5c5c;"

          } else {

            hoverDivHTML=getHoverDivHTML(currentDate,dateWidth, dateHeight);
            if(hoverDivHTML){
              classes = "calendarSpecialDate " + classes;
            }
          }



          dateHTML  +='<div style="' + styles + '" class="' + classes + '">'
                    +'<div>'
                    +     currentDate.getDate()
                    +'</div>'
                    + hoverDivHTML
                    +' </div>';

          currentDate.setDate(currentDate.getDate()+1);
      }

      dateHTML +='</div>';

    }

    return dateHTML;

  }
  function getHoverDivHTML(currentDate,dateWidth, dateHeight){
    // debugger;
    var arr = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate();
    var containerHeight =height*0.33;
    var eventsHTML="";
    if(SPECIAL_DATES[arr]){
      var events = SPECIAL_DATES[arr];
      var width= dateWidth*4,
          height= dateHeight*1.5;
      var containerHeight =height*0.33;
      // eventsHTML = '<div style="width:' + width + 'px;height:' + height + 'px;top:-' + ( dateHeight * 1.7 ) + 'px;left:-' + ( dateWidth * 3 ) + 'px;" class="dateClassHover">'
      var title ='<div style="margin-bottom:3px;padding-left:10px;border-bottom:red solid 2px;width:'+(width-10)+'px;height:'+(height*0.33)+'px;text-align:left;line-height:'+(height*0.33)+'px;">'
                + (currentDate.getMonth()+1) + '月' + currentDate.getDate() + '号'
                +'</div>';

      var contents = "";
      for(var i = 0; i < events.length; i++){
        contents+='<div style="padding-left:10px;solid 2px;width:'+(width-10)+'px;height:'+(height*0.3)+'px;text-align:left;line-height:'+(height*0.3)+'px;">'
                 + events[i]
                 + '</div>';
        containerHeight += height*0.3;
      }
      containerHeight += height*0.1;
      var containerDiv='<div style="width:' + width + 'px;height:' + containerHeight + 'px;top:-' + ( containerHeight + 13 ) + 'px;left:-' + ( dateWidth * 3 ) + 'px;" class="dateClassHover">'
      eventsHTML = containerDiv +title + contents + '</div>';
    }

    return eventsHTML;
  }






  function monthClick(monthId){


    var nodes = document.getElementById(monthId).parentNode.childNodes;
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].nodeType !=1){
        continue;
      }
      if(nodes[i].getAttribute("id")== monthId){
        nodes[i].setAttribute("class","monthCellActive monthCell");

      } else {
        nodes[i].setAttribute("class", monthTHClass)
      }
    }

    // var currentMonth = new Date(monthId.split("_")[1],monthId.split("_")[2],1);
    // var innerhtml = getDatesHTML(currentMonth,width,(height*0.75),"calendarDateCell","calendarRow");//75%
    // document.getElementById(dateContainerID).innerHTML = innerhtml;
  }




  function AppendMonthActiveClass (domID) {
    var node = document.getElementById(domID);
    var klass = node.getAttribute("class") + " " + monthActiveClass;
    node.setAttribute("class",klass);
  }



  function installer2(id,beginDate,finishDate,initWidth,initHeight,specialDates){

    startDate = new Date(parseInt(beginDate.split("-")[0]),(parseInt(beginDate.split("-")[1])-1),parseInt(beginDate.split("-")[2]));
    endDate = new Date(parseInt(finishDate.split("-")[0]),(parseInt(finishDate.split("-")[1])-1),parseInt(finishDate.split("-")[2]));
    if(startDate == "Invalid Date"|| endDate =="Invalid Date"){
      return;
    }

    SPECIAL_DATES=specialDates

    //init currentMonth
    var currentDate = new Date();
    if(currentDate > endDate || currentDate < startDate){
      currentDate = startDate;
    }
    width = initWidth;
    height = initHeight;


    var style = 'style="width:' + (width+4) + 'px;height:' + (height+4) + 'px;"';

    var tableBegin            = '<div ' + style + ' class="calendarTable">';
    var monthHTML             = setupMonth(startDate, endDate, currentDate, monthTHClass, monthTHActiveClass, monthPrefix, width, (height*0.14));//h:14%
    var dayTHHTML             = setupDay(width, (height*0.11), "calendarRow", "calendarRowMargin", "calendarCell");//H:11%
    var dateRowHTML           = setupDate(currentDate,width,(height*0.75),"calendarDateCell","calendarRow");//75%
    var tableEnd              = '</div>';


    document.getElementById(id).innerHTML  = tableBegin
                                           + monthHTML
                                           + dayTHHTML
                                           + dateRowHTML
                                           + tableEnd ;
  }


  function installer(id,beginDate,finishDate,initWidth,initHeight,specialDates){


    // 初始化起始日期
    startDate = new Date(parseInt(beginDate.split("-")[0]),(parseInt(beginDate.split("-")[1])-1),parseInt(beginDate.split("-")[2]));
    endDate = new Date(parseInt(finishDate.split("-")[0]),(parseInt(finishDate.split("-")[1])-1),parseInt(finishDate.split("-")[2]));
    if(startDate == "Invalid Date"|| endDate =="Invalid Date"){
      return;
    }

    // 初始化active 的月份
    var activeMonth = new Date();
    if(activeMonth > endDate || activeMonth < startDate){
      activeMonth = startDate;
    }

    // 初始化特殊日期
    SPECIAL_DATES=specialDates


    var node = document.getElementById(id);

    //宽度，减去4px的边框
    var width = node.clientWidth - 4;

    //高度，减去4px的边框
    var height = node.clientHeight;

    var monthHTML = drawMonthHTML( width, height* 0.14, startDate, endDate, activeMonth ); //月份是总高度的14%

    var dayHTML = drawDayHTML(width, height*0.11); //星期高度是11%


    var innerHTML = monthHTML + dayHTML;
    var html = drawDIV(innerHTML, "calendarRootContainer", null,"container");

    document.getElementById(id).innerHTML  = html;
  }







  function drawMonthHTML(width, height, startDate, endDate, activeMonth){

    //初始化
    var monthIdPrefix  = "monthCell" + Math.ceil(Math.random()*10000);

    var monthCount = (endDate.getFullYear()-startDate.getFullYear()) * 12 + endDate.getMonth()-startDate.getMonth() + 1;

    //每个月份的单元格之间的间距是 3px
    var cellMargins = ( monthCount - 1 ) * 3;

    //计算出每一个月份单元格的宽度
    var cellWidth = ( width - cellMargins ) / monthCount;

    var innerHTML = "";

    var cellClass, cellStyle, cellClick,cellId;

    var iteratorMonth = startDate;

    for (var i = 0; i < monthCount; i++ ){


      cellClass = "monthCell";

      //当前被选中的月份添加样式
      if(activeMonth.getFullYear() == iteratorMonth.getFullYear() && activeMonth.getMonth() == iteratorMonth.getMonth()){
        cellClass = "monthCellActive monthCell";
      }


      cellStyle = 'width:' + cellWidth + 'px;height:inherit;line-height:'+height+'px;'

      //最后一个没有margin-right
      if (i == monthCount-1) {
        cellStyle += "margin-right:0px;"
      }

      //生成月份元素的id
      cellId = monthIdPrefix + "_" + iteratorMonth.getFullYear()+ "_" + iteratorMonth.getMonth();

      cellClick = "window.calendar.onMonthClick('" + cellId + "')";

      innerHTML += drawDIV ( MONTH[iteratorMonth.getMonth()], cellClass, cellStyle, cellId, cellClick)


      iteratorMonth= new Date(iteratorMonth.getFullYear(),iteratorMonth.getMonth()+1,1);
    }



    var innerStyle = 'width:'+ width*0.5 +'px;';
        innerStyle += 'height:'+ height +'px;';
        innerStyle += 'line-height:'+ height +'px;';

    var style = 'width:'+ width +'px;';
        style += 'height:'+ height +'px;';




    var html = drawDIV(innerHTML, "monthRow", style);

    return html;
  }


  function drawDayHTML(width, height) {

    var innerHTML = "";

    var cellClass = "dayCell";

    var cellWidth = (width-20) / 7

    var cellStyle = "width:" + cellWidth + "px;height:" + (height - 1) +"px;line-height:"+ (height - 1) +"px;";


    for(var i = 0; i < 7; i++) {
      innerHTML += drawDIV(WEEKHEADERS[i],cellClass,cellStyle)
    }



    var style='width:'+(width-20)+'px;height:'+height+'px;';
    var html = drawDIV(innerHTML,"dayRow",style)

    return html;


  }

  function drawDateHTML(width, height) {

    var innerHTML = "";

    var cellClass = "dayCell";

    var cellWidth = (width-20) / 7

    var cellStyle = "width:" + cellWidth + "px;height:" + (height - 1) +"px;line-height:"+ (height - 1) +"px;";


    for(var i = 0; i < 7; i++) {
      innerHTML += drawDIV(WEEKHEADERS[i],cellClass,cellStyle)
    }



    var style='width:'+(width-20)+'px;height:'+height+'px;';
    var html = drawDIV(innerHTML,"dayRow",style)

    return html;


  }



  /*创建单元格
   *@param {string} innerHTML 创建div的innerHTML
   *@param {string} id 所创建div的id
   *@param {string} klass 所创建div的class
   *@param {string} click 所创建div的click事件
   *@return {string} 生成div的html
   */
  function drawDIV ( innerHTML, klass, style, id, click) {

    if(!innerHTML){
      innerHTML ="";
    }

    var attrs = '';

    if (style) {
      attrs += ' style = "' + style + '"';
    }

    if (klass) {
      attrs += ' class = "' + klass + '"';
    }

    if (id) {
      attrs += ' id = "' + id + '"';
    }

    if (click) {
      attrs += ' onclick = "' + click +'"';
    }

    var html = '<div '+ attrs +' >' + innerHTML + '</div>';

    return html;
  }



  g.calendar={
         install:installer,
    onMonthClick:monthClick
  }
})(window||global)
