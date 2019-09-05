function tetsRecords(){

}

function Records(){

  var getRowsForSheet = function(records){
    var ret = {}
    var rows = []
    var columns = getColumns(records)
    rows.push(columns)
    
    for(var recordId in records){
      var record = records[recordId]
      var row = []
      for(var columnId in columns){
        var column = columns[columnId]
        var value = (record[column]===undefined)?"":record[column];
        row.push(value)                
      }
      rows.push(row)
    }    

    return rows    
  }
      
  var getColumns = function(records){
    var columns = {}
    for(var recordId in records){
      var record = records[recordId]
      for(column in record){
        columns[column] = ""
      }
    }
    
    return Object.keys(columns)    
  }
  
  var getRowsForSheetValidated = function(records){
    var ret = {}
    try{
      ret.arr = getRowsForSheet(records)
      ret.status = "OK"
    }catch(e){
      ret.status = "error"
      ret.mes = e
    }
    return ret
  }
  
  
  
  return {
    getRowsForSheet:getRowsForSheet,
    getRowsForSheetValidated:getRowsForSheetValidated
  }
}
