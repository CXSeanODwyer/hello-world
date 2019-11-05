//Durty Deputy Data Dump
//Strips away all html elemnts on page and builds a dynamic GUI
//that allows you to export data from Deputy in CSV format
//---------------------------------------------------------
// Dump button - Dumps the data into CSV
// I only want some fields tho - Lets you choose the fields you want to export - allows querying
// can currently only query one field at a time
 
 
//remove other stuff
$("#deputec_index").remove();
 
//Useful functions
function JSONToCSVConvertor(e, r, a) {
  var t = "object" != typeof e ? JSON.parse(e) : e,
    n = "";
  if (((n += r + "\r\n\n"), a)) {
    var o = "";
    for (var i in t[0]) o += i + ",";
    n += (o = o.slice(0, -1)) + "\r\n";
  }
  for (var c = 0; c < t.length; c++) {
    o = "";
    for (var i in t[c]) o += '"' + t[c][i] + '",';
    o.slice(0, o.length - 1), (n += o + "\r\n");
  }
  if ("" != n) {
    var d = "MyReport_";
    d += r.replace(/ /g, "_");
    var l = "data:text/csv;charset=utf-8," + escape(n),
      v = document.createElement("a");
    (v.href = l),
      (v.style = "visibility:hidden"),
      (v.download = d + ".csv"),
      document.body.appendChild(v),
      v.click(),
      document.body.removeChild(v);
  } else alert("Invalid data");
}
 
//Functions  behind menu options
function ExportAll() {
    debugger
  //Need to run the javascript to create the JSONToCSVConvertor function
var isSearch = false
var searchTerms = []
  //check if we search
  $('input[type="text"]').each(function(){
    // Do your magic here
    if (this.value != ''){
        isSearch = true
        debugger
        searchTerms.push(this.value, this.id.replace("search", ""))
    }
 
});
 
console.log(searchTerms)
 
var Resource = $("#DDLExportAllToCSV").val();
var strReportTitle = Resource + " For Client";
if(isSearch){
   // debugger
    $.post(
        "/api/v1/resource/" + Resource + "/QUERY",
        JSON.stringify({
          search: {
            s1: { field:searchTerms[1] , data: searchTerms[0], type: "eq" }
          },
          max: 10000
        }),
        function(data) {
            var NewData = []
        _.each(data, function(DataChild) {
          // debugger
            $.each($("input:checkbox:not(:checked)"), function() {
              var removeMe = $(this).val()
              delete DataChild[removeMe]
               
            });
            delete DataChild['_DPMetaData']
            NewData.push(DataChild)
        })//Each
          
     
          JSONToCSVConvertor(NewData, strReportTitle, true);
        }
      );
 
} else{
    $.post(
        "/api/v1/resource/" + Resource + "/QUERY",
        JSON.stringify({
          search: {
            s1: { field: "Id", data: "TestString", type: "nk" }
          },
          max: 10000
        }),
        function(data) {
            var NewData = []
        _.each(data, function(DataChild) {
          // debugger
            $.each($("input:checkbox:not(:checked)"), function() {
              var removeMe = $(this).val()
              delete DataChild[removeMe]
               
            });
            NewData.push(DataChild)
        })//Each
          
     
          JSONToCSVConvertor(NewData, strReportTitle, true);
        }
      );
}//else
 
  
}//function
 
function ChooseFields() {
  var Resource = $("#DDLExportAllToCSV").val();
  var FieldDetails = "";
 
  var myPayRules;
 
  $.post(
    "/api/v1/resource/" + Resource + "/QUERY",
    JSON.stringify({
      search: {
        s1: { field: "Id", data: "1", type: "eq" }
      }
    }),
    function(data) {
      delete data[0]['_DPMetaData']
      for (var key in data[0]) {
        FieldDetails =
          "<input type='checkbox' name='" +
          key +
          "' value='" +
          key +
          "' checked>" +
          key +
          " <input style='margin-left:20px' type='Text' id='search" + key +  "'>" +
          "<br>";
        $("#ShowFields").append(FieldDetails);
        // console.log(key);
      }
    }
  );
}

function ShowMe(){
  var Resource = $("#DDLExportAllToCSV").val();

  $.post(
    "/api/v1/resource/" + Resource + "/QUERY",
    JSON.stringify({
      search: {
        s1: { field: "Id", data: "TestString", type: "nk" }
      },
      max: 10
    }),
    function(data) {
        var NewData = []
    _.each(data, function(DataChild) {
      // debugger
        $.each($("input:checkbox:not(:checked)"), function() {
          var removeMe = $(this).val()
          delete DataChild[removeMe]
           
        });
        delete DataChild['_DPMetaData']
        NewData.push(DataChild)
    })//Each
      
    CreateTableFromJSON(NewData)
    }
  );
}//showme
 
function SelectNone(){
    $('input:checkbox').removeAttr('checked');
}//sleect None
 
function SelectAll(){
    $("input:checkbox").prop('checked',true);
}//sleect None
 
//layout for menu
var menu = "";
menu += "<table><tr><td colspan='1'><img height='120px' width='120px' src='https://d1m66yh0amo3la.cloudfront.net/deputec_my_deputy/-500x500_4fb2bea699b471e3ad73f6bb9c944e0d.jpg?Expires=1572646063&amp;Key-Pair-Id=APKAINP5UVPK4IGBHXOQ&amp;Signature=YBEhktDvgv5Z0tx1SnZemiXHRgUT98nvz8GfhbDli4PXeSNhC5mKStvjxBlnXRfBhUYedqeTynA4Mou6R4GoKgUDMNy~WsA~1Fe3V6ASfyUfoAld6qRYNYZa3WBXhZ5d8DwAXeDrI-zvZATwdiR3AX~86rrsWMdQAn3-dB~PMsU_>'"
menu += "</td><td colspan='4'><span style='font-size: xx-large;'>DURTY DEPUTY DATA DUMP</span></td></tr></table>"
menu += "<table class='tg'>";
menu += "    <tr>'";
menu += "    <th class='tg-0lax'>";
menu += "    <select ID='DDLExportAllToCSV'>";
menu += "<option value='Address'>Address</option>";
menu += "<option value='Category'>Category</option>";
menu += "<option value='Comment'>Comment</option>";
menu += "<option value='Company'>Company</option>";
menu += "<option value='CompanyPeriod'>CompanyPeriod</option>";
menu += "<option value='Contact'>Contact</option>";
menu += "<option value='Country'>Country</option>";
menu += "<option value='CustomAppData'>CustomAppData</option>";
menu += "<option value='CustomField'>CustomField</option>";
menu += "<option value='CustomFieldData'>CustomFieldData</option>";
menu += "<option value='Employee'>Employee</option>";
menu += "<option value='EmployeeAgreement'>EmployeeAgreement</option>";
menu +=
  "<option value='EmployeeAgreementHistory'>EmployeeAgreementHistory</option>";
menu += "<option value='EmployeeAppraisal'>EmployeeAppraisal</option>";
menu += "<option value='EmployeeAvailability'>EmployeeAvailability</option>";
menu += "<option value='EmployeeHistory'>EmployeeHistory</option>";
menu += "<option value='EmployeePaycycle'>EmployeePaycycle</option>";
menu +=
  "<option value='EmployeePaycycleReturn'>EmployeePaycycleReturn</option>";
menu += "<option value='EmployeeRole'>EmployeeRole</option>";
menu +=
  "<option value='EmployeeSalaryOpunitCosting'>EmployeeSalaryOpunitCosting</option>";
menu += "<option value='EmployeeWorkplace'>EmployeeWorkplace</option>";
menu += "<option value='EmploymentCondition'>EmploymentCondition</option>";
menu += "<option value='EmploymentContract'>EmploymentContract</option>";
menu +=
  "<option value='EmploymentContractLeaveRules'>EmploymentContractLeaveRules</option>";
menu += "<option value='Event'>Event</option>";
menu += "<option value='Geo'>Geo</option>";
menu += "<option value='Journal'>Journal</option>";
menu += "<option value='Kiosk'>Kiosk</option>";
menu += "<option value='Leave'>Leave</option>";
menu += "<option value='LeaveAccrual'>LeaveAccrual</option>";
menu += "<option value='LeavePayLine'>LeavePayLine</option>";
menu += "<option value='LeaveRules'>LeaveRules</option>";
menu += "<option value='Memo'>Memo</option>";
menu += "<option value='OperationalUnit'>OperationalUnit</option>";
menu += "<option value='PayPeriod'>PayPeriod</option>";
menu += "<option value='PayRules'>PayRules</option>";
menu += "<option value='PublicHoliday'>PublicHoliday</option>";
menu += "<option value='Roster'>Roster</option>";
menu += "<option value='RosterOpen'>RosterOpen</option>";
menu += "<option value='RosterSwap'>RosterSwap</option>";
menu += "<option value='SalesData'>SalesData</option>";
menu += "<option value='Schedule'>Schedule</option>";
menu += "<option value='SmsLog'>SmsLog</option>";
menu += "<option value='State'>State</option>";
menu += "<option value='StressProfile'>StressProfile</option>";
menu += "<option value='SystemUsageBalance'>SystemUsageBalance</option>";
menu += "<option value='SystemUsageTracking'>SystemUsageTracking</option>";
menu += "<option value='Task'>Task</option>";
menu += "<option value='TaskGroup'>TaskGroup</option>";
menu += "<option value='TaskGroupSetup'>TaskGroupSetup</option>";
menu += "<option value='TaskOpunitConfig'>TaskOpunitConfig</option>";
menu += "<option value='TaskSetup'>TaskSetup</option>";
menu += "<option value='Team'>Team</option>";
menu += "<option value='Timesheet'>Timesheet</option>";
menu += "<option value='TimesheetPayReturn'>TimesheetPayReturn</option>";
menu += "<option value='TrainingModule'>TrainingModule</option>";
menu += "<option value='TrainingRecord'>TrainingRecord</option>";
menu += "</select>";
menu += "    </th>";
menu += "    <th class='tg-0lax'>";
menu += "    <button style='padding:5px' onclick='ExportAll()'>Dump</button>";
menu += "    </th>";
menu += "    <th class='tg-0lax'>";
menu += "    <button  style='padding:5px' onclick='ChooseFields()'>I only want some fields tho</button>";
menu += "    </th>";
menu += "    <th class='tg-0lax'>";
menu += "    <button  style='padding:5px' onclick='ShowMe()'>Show Me !</button>";
menu += "    </th>";
menu += "    </tr>";
menu += "    <tr>";
menu += "    </tr>";
menu += "    </table>";
menu += "<div><button id='btnall' style='padding:10px;margin-right:50px;margin-left:80px' type='button' onclick='SelectAll()'>All</button>"
menu += "<button id='btnnone' type='button' style='padding:10px;margin-right:50px' onclick='SelectNone()'>None</button></div>"
menu += " <div id=ShowFields style='border:solid; padding-left:80px'> </div>";
menu += " <div id=ShowData style='border:solid; padding-left:80px'> </div>";
 
$("body").append(menu);
 
$("#DDLExportAllToCSV").change(function() {
  var myNode = document.getElementById("ShowFields");
  var myNode2 = document.getElementById("ShowData");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  
  while (myNode2.firstChild) {
    myNode2.removeChild(myNode2.firstChild);
  }
});

function CreateTableFromJSON(Data) {
  
  // EXTRACT VALUE FOR HTML HEADER. 
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  var col = [];
  for (var i = 0; i < Data.length; i++) {
      for (var key in Data[i]) {
          if (col.indexOf(key) === -1) {
              col.push(key);
          }
      }
  }

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1);                   // TABLE ROW.

  for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");      // TABLE HEADER.
      th.innerHTML = col[i];
      tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < Data.length; i++) {

      tr = table.insertRow(-1);

      for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = Data[i][col[j]];
      }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("ShowData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}
