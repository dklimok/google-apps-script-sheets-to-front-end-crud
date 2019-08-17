// TODO test and comments

function testDrive(){

  var ssId = "1Dt9Xs7gZKrhxAl9iVMhL3l-E6xuHW4B3lga9WxWVXy0"  //gapi
  var wsName = "Business Profile"

  var config= initConfig()
  var colmap = config['colmap Business Profile']
  //var driveResp = Drive().getDaFromWsInSsParsed(ssId,wsName,colmap)
  
  var search = {
    "HH Space ID":"hh2",
    "Business E-mail":"e2"
  }
  var filteredResp = Drive().getDaFromWsInSsParsedAndFiltered(ssId,wsName,colmap,search)
  return
}


function Drive(config) {
  if(config===undefined){
    config= initConfig()
  }
  
  var Errors = function(){
    var set = function(status,mes){
      return {
        status:status,
        mes:mes
      }
    }
    return set
  }
  
  var getSsById = function(ssId){
    try{
      return{
        status:"OK",
        ss:SpreadsheetApp.openById(ssId)
      }
    }catch(e){
      return Errors().set("errow in file with id "+ ssId, e)
    }    
  }
  
  var getJsonById = function(fileId){
    try{
      var file = DriveApp.getFileById(fileId)
      var text = file.getBlob().getDataAsString()
      var json = JSON.parse(text)
      return{
        status:"OK",
        json:json
      }
    }catch(e){
      return Errors().set("errow with getting json from file with id "+ fileId, e)
    }    
  }
  
  var getWsByName = function(ss,wsName){
    try{
      return{
        status:"OK",
        ws:ss.getSheetByName(wsName)
      }
    }catch(e){
      Errors().set("errow with sheet named "+ wsName, e)
    }  
  }

  var getWsInSs = function(ssId,wsName){
    var ssResp = getSsById(ssId)
    if(ssResp.status!="OK"){return ssResp}
    return getWsByName(ssResp.ss,wsName)
  }
  
  
  var getDaFromWsInSs = function(ssId,wsName){
    var ssResp = getSsById(ssId)
    if(ssResp.status!="OK"){return ssResp}
    var wsResp = getWsByName(ssResp.ss,wsName)
    if(wsResp.status!="OK"){return wsResp}
    try{
      return{
        status:"OK",
        da:wsResp.ws.getDataRange().getValues()
      }
    }catch(e){
      Errors().set("errow on da get with sheet named "+ wsName, e)
    }      
  }
  
  
  var getDaFromWsInSsParsed = function(ssId,wsName,colmap,mode){
    
    var modes = {
      rowNumberIsKey:"rowNumberIsKey",
      idColumnIsKey:"idColumnIsKey",
      columnTitlesAreKeys:"columnTitlesAreKeys"
    }
    
    var configKeysForbiddenToParse = [
        "_firstRow",
        "_emptyCheck",
        "_idColumn",
        "_mode",
        "_keysRow"
    ]
    
    var getTitles = function(da){
      if(colmap._titlesRow){
        return da[Number(colmap._titlesRow)-1]
      }else{
        return []
      }
    }
    
    var checkIfProcessRow = function(rowId){
      if(Number(rowId)+1>=colmap._firstRow){
        return true 
      }else{
        return false
      }
    }
    
    var checkIfNotEmply = function(row){
       if(row[Number(colmap._emptyCheck)-1]!=""){
        return true
      }else{
        return false
      }   
    }    
    
    var getRow = function(row){
      var ret = {}
      for(var key in colmap){
          if(checkIfProcessKey(key)){
            ret[key] = row[Number(colmap[key])-1]
          }else{
            continue
          }
      }
      return ret
    }

    var getRowTitled = function(row,titles){
      var ret = {}
      for(var columnId in titles){
          if(columnId!=""){
            ret[titles[columnId]] = row[columnId]
          }else{
            continue
          }
      }
      return ret
    }


    var checkIfProcessKey = function(key){
      if(configKeysForbiddenToParse.indexOf(key)==-1){
        return true
      }else{
        return false
      }
    }

    var daFromWsInSsResp = getDaFromWsInSs(ssId,wsName)
    if(daFromWsInSsResp.status!="OK"){return daFromWsInSsResp}
        
    var rows = {}    
        
    var titles = getTitles(daFromWsInSsResp.da)
                
    for(var rowId in daFromWsInSsResp.da){
      if(checkIfProcessRow(rowId)){
        var row = daFromWsInSsResp.da[rowId]
          if(checkIfNotEmply(row)){
            if(colmap._mode==modes.idColumnIsKey){
              var id =  row[Number(colmap._idColumn)-1]
              var rowObj = getRow(row)              
              rows[id] = rowObj              
            }else if(colmap._mode==modes.rowNumberIsKey){
              var id =  rowId
              var rowObj = getRow(row)              
              rows[id] = rowObj              
            }else if(colmap._mode==modes.columnTitlesAreKeys){
              var id =  rowId
              var rowObj = getRowTitled(row,titles)              
              rows[id] = rowObj              
            }

          }else{
            continue
          }
        }else{
          continue
        }
    }
    
    return {
              status:"OK",
              rows:rows
            }
  }
  
  
  var getDaFromWsInSsParsedAndFiltered = function(ssId,wsName,colmap,search){
    var isMatch = function(row,search){      
      for(var title in search){
        var valueToBe = search[title]
        var valueIs = row[title]
        if(valueToBe==valueIs){
          //dn
        }else{
          return false
        }        
      }
      return true
    }
    
    var voidDeleteIfNotMatch = function(parsed,search){         
      for(var rowId in parsed.rows){
        var isMatchResp = isMatch(parsed.rows[rowId],search)
        if(isMatchResp){
          //dn
        }else{
          delete parsed.rows[rowId]
        }
      }
    }
    
    var parsedResp = getDaFromWsInSsParsed(ssId,wsName,colmap,"columnTitlesAreKeys")
    if(parsedResp.status!="OK"){return parsedResp}
    voidDeleteIfNotMatch(parsedResp,search)
    parsedResp.rowsFound = (Object.keys(parsedResp.rows)).length
    return parsedResp    

  }
  
  
  return {
    getSsById:getSsById,
    getJsonById:getJsonById,
    getWsByName:getWsByName,    
    getWsInSs:getWsInSs,
    getDaFromWsInSs:getDaFromWsInSs,
    getDaFromWsInSsParsed:getDaFromWsInSsParsed,
    getDaFromWsInSsParsedAndFiltered:getDaFromWsInSsParsedAndFiltered
  }

}  
