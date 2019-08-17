// run it to get the idea
function testLog(){
  var mes = "bla, bla" //string
  var num = 1 //number
  var obj = {foo:"boo"} //object
  var row = ["1","2"] //object
  var nul = null
  
  Log(mes)
  Log(num)
  Log(obj)
  Log(row)
  Log()
  Log(nul)
}

/**
* the script will:
* get data type of input, process it accordingly, 
* will add timestamp 
* and add as a new row to google file and sheet associated with destination. it's recommended to make new file for log destination if there will be 10K+ log rows. 
* @param {whatever} data - put any values, row range values and functions responses. objects will be stringlified
* [ @param {string} destination ] - some clear for you name of destination. by default print to "web log". 

*/

function Log(data,destination){
  
  var getDataType = function(data){
    var type = typeof data
    if(type=="object"){
      if(data===null){
        return "mes"
      }else if(data.length===undefined){
        return "obj"
      }else{
        return "row"
      }    
    }else if(type===undefined){
      return "undef"
    }else{
      return "mes"
    }
  }
  
  var getRow = function(data,type){
    // adds timestamp and prepare row to paste to destination
    var date = (new Date()).toISOString()
    
    if(type=="row"){
      data.unshift(date)
      return data
    }else if(type=="obj"){
      return [date,JSON.stringify(data,null,3)]
    }else{
      return [date,data]
    }
  }
 
 // ---- main ----
 
  // associate name of destination with sheet here
  if(destination===undefined){    
    var ws = SpreadsheetApp.getActive().getSheetByName("web Log")
  }else{
    var ws = SpreadsheetApp.getActive().getSheetByName("web Log")  
  }
  
  
  var type = getDataType(data)
  var row = getRow(data,type)
  ws.appendRow(row)

}
