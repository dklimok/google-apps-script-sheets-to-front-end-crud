/**
* GET POST will be handled according to mode and request source
* the GAPI url looks like this 
* https://script.google.com/macros/s/{script Id}/exec?mode=foo
*/

/**
 * strings are declared once
 */
var GAPI_MODES = {
      gsToJson:"gs-to-json",// unsafe
      gsToJsonSafe:"gs-to-json-safe",// unsafe
    }
    
//doGet is google apps script reserved function name. it runs on GET requests.
function doGet(e) {
  Log(e)
  
    /**
    * https://script.google.com/macros/s/{script Id}/exec?mode=foo
    * is equal to 
    * var e = {parameter:{
    *    "mode": "foo"  
    *    }
    * }
    */
    
  var paramsObj = e.parameter // ?mode=foo turns into e.parameter = {mode:foo}

  if(paramsObj.mode==""){
    var resp = {} // here to be some function that returns object
    
    // the object is wrapped by output() according to request source and is sent to response 
    
    return output().web(e,resp)
  }else{
    return output().fromDefault(e)
  }
}



//doPost is google apps script reserved function name. it runs on POST requests.

function doPost(e) {
   Log(e)
   var mode = e.parameter.mode; Log(mode);
   var data = e.postData.contents; Log(data)
   
   // for post request all selection of handlers according to modes and data is taken into separate function.
   // as some posted values may influence on handler selection
   // and to keep the function small and clear
   
   var responseObj = router(mode,data); 
   Log(responseObj)        
   return output().web(e,responseObj)   
}




function  output(){
  /*
  * returns functions: 
  *   fromDefault - for cases when provided mode don't have handler yet
  *   web - for other cases
  */

  var fromDefault= function(e){
     //prepares error details and retnrns function web()
        Log("there is no handler for "+e.pathInfo)
        var obj = {status:"there is no handler for "+e.pathInfo + " e: " +JSON.stringify(e,false,2)}
        return (ret.web(e,obj))
  }
    
  /**
  *@param {Object} obj that will be returned as json as GAPI response
  */  
  var web = function(e,obj){
      Log(["web output obj status "+obj.status])
      if(e.parameter.callback===undefined){
        return ContentService.createTextOutput(JSON.stringify(obj))
      }else{ // for AJAX
        // if GAPI is called by $.ajax it shall be wrapped 
         return ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(obj) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);   
      }

  }

  return {
    fromDefault:fromDefault,
    web:web
  }
  
}

// TODO comments
function router(mode,data){
  var ret = {}
  // convert data string into object
   try{
      var dataObj = JSON.parse(data)
    }catch(e){
      // we expect json. so if it's not - something went wrong
      return {
        status: "error in json "+ data
      }
    }  
    
  var config = initConfig()
  
  if(mode==GAPI_MODES.gsToJson){
    var ssId = dataObj.fileId
    var wsName = dataObj.sheetName
    var colmap = dataObj.colmap
    var search = dataObj.search
    var resp = Drive().getDaFromWsInSsParsedAndFiltered(ssId,wsName,colmap,search)    
    return resp
  }else  if(mode==GAPI_MODES.gsToJsonSafe){    
    var projectName = dataObj.projectName
    var ssId = config[projectName].fileId
    var wsName = config[projectName].sheetName
    var colmap = {
      _mode:config[projectName]._mode,
      _firstRow:config[projectName]._firstRow,
      _emptyCheck:config[projectName]._emptyCheck,
      _titlesRow:config[projectName]._titlesRow
    }
    var search = dataObj.search
    var resp = Drive().getDaFromWsInSsParsedAndFiltered(ssId,wsName,colmap,search)    
    return resp
  }
  else{
    ret = {status:"there is no handler for "+mode} 
  }  
  return ret
}






// some emulates to play with data


function emulatePostGsToJsonUnsafe(){
  var fileId = "1Dt9Xs7gZKrhxAl9iVMhL3l-E6xuHW4B3lga9WxWVXy0"
  var sheetName = "Business Profile"
  var search = {
    "HH Space ID":"hh2",
   // "Business E-mail":"e2"
  }
  var colmap = {
    _mode:"columnTitlesAreKeys",
    _firstRow:2,
    _emptyCheck:1,
    _titlesRow:1    
  }
  
  var payload = {        
    fileId: fileId, // from the source config
    sheetName: sheetName, // from the source config
    search:search,
    colmap:colmap
  }
  
  var e = {
    parameter:
      {
        "mode": GAPI_MODES.gsToJson
      },    
    postData:{
      contents:JSON.stringify(payload)   
      }
  }
  
  doPost(e)
}

function emulateGet(){
  // https://script.google.com/macros/s/{script Id}/exec?mode=foo
  // is equal to 
  var e = {parameter:{
    "mode": "foo"  
  }}
  
  doGet(e)
}


function emulatePostGsToJsonSafe(){
  var projectName = "projectOnboarding-BP"
  var search = {
    "HH Space ID":"hh2",
   // "Business E-mail":"e2"
  }
  
  var payload = {        
    projectName: projectName,    
    search:search,    
  }
  
  var e = {
    parameter:
      {
        "mode": GAPI_MODES.gsToJsonSafe
      },    
    postData:{
      contents:JSON.stringify(payload)   
      }
  }
  
  doPost(e)
}

