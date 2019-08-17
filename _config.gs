/**
goes to "config" sheet and converts rows to object
the object have 
*/

function initConfig() {
  var ws =SpreadsheetApp.getActive().getSheetByName("config")
  var da =ws.getDataRange().getValues()
  var config = {}
  da.forEach(function(row){
    if(row[0]!=""&&row[1]!=""){
      if(row[2]!=""){
        if(config[row[2]]==undefined){
          config[row[2]]={}
        }
          config[row[2]][row[0]]=row[1]
      }else{
      config[row[0]]=row[1]
      }
    }
  })
  return config
}
